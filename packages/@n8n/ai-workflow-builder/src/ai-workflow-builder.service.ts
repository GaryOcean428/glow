import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { RunnableConfig } from '@langchain/core/runnables';
import { StateGraph, END, START } from '@langchain/langgraph';
import { GlobalConfig } from '@n8n/config';
import { Service } from '@n8n/di';
import { AiAssistantClient } from '@n8n_io/ai-assistant-sdk';
import { OperationalError, assert, INodeTypes } from 'n8n-workflow';
import type { IUser, INodeTypeDescription, INode } from 'n8n-workflow';

import { connectionComposerChain } from './chains/connection-composer';
import { nodesSelectionChain } from './chains/node-selector';
import { nodesComposerChain } from './chains/nodes-composer';
import { plannerChain } from './chains/planner';
import { validatorChain } from './chains/validator';
import { ILicenseService } from './interfaces';
import { anthropicClaude37Sonnet, gpt41mini } from './llm-config';
import { PromptAuditor } from './security/prompt-auditor';
import type { MessageResponse } from './types';
import { WorkflowState } from './workflow-state';

@Service()
export class AiWorkflowBuilderService {
	private parsedNodeTypes: INodeTypeDescription[] = [];

	private llmSimpleTask: BaseChatModel | undefined;

	private llmComplexTask: BaseChatModel | undefined;

	private client: AiAssistantClient | undefined;

	private promptAuditor: PromptAuditor;

	constructor(
		private readonly licenseService: ILicenseService,
		private readonly nodeTypes: INodeTypes,
		private readonly globalConfig: GlobalConfig,
		private readonly n8nVersion: string,
	) {
		this.parsedNodeTypes = this.getNodeTypes();
		this.promptAuditor = new PromptAuditor();
	}

	private async setupModels(user: IUser) {
		if (this.llmSimpleTask && this.llmComplexTask) {
			return;
		}

		const baseUrl = this.globalConfig.aiAssistant.baseUrl;
		// If base URL is set, use api-proxy to access LLMs
		if (baseUrl) {
			try {
				if (!this.client) {
					const licenseCert = await this.licenseService.loadCertStr();
					const consumerId = this.licenseService.getConsumerId();

					this.client = new AiAssistantClient({
						licenseCert,
						consumerId,
						baseUrl,
						n8nVersion: this.n8nVersion,
					});
				}

				assert(this.client, 'Client not setup');

				const authHeaders = await this.client.generateApiProxyCredentials(user);
				this.llmSimpleTask = gpt41mini({
					baseUrl: baseUrl + '/v1/api-proxy/openai',
					// When using api-proxy the key will be populated automatically, we just need to pass a placeholder
					apiKey: '-',
					headers: {
						Authorization: authHeaders.apiKey,
					},
				});
				this.llmComplexTask = anthropicClaude37Sonnet({
					baseUrl: baseUrl + '/v1/api-proxy/anthropic',
					apiKey: '-',
					headers: {
						Authorization: authHeaders.apiKey,
					},
				});
				return;
			} catch (error) {
				throw new OperationalError(
					`Failed to setup AI assistant client: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		}

		// If base URL is not set, use environment variables
		const openaiApiKey = process.env.N8N_AI_OPENAI_API_KEY;
		const anthropicApiKey = process.env.N8N_AI_ANTHROPIC_KEY;

		// Validate that at least one API key is provided
		if (!openaiApiKey && !anthropicApiKey) {
			throw new OperationalError(
				'No AI API keys configured. Please set N8N_AI_OPENAI_API_KEY or N8N_AI_ANTHROPIC_KEY environment variables, or configure aiAssistant.baseUrl for proxy access.'
			);
		}

		// Validate API key format (basic validation)
		if (openaiApiKey && !openaiApiKey.startsWith('sk-')) {
			throw new OperationalError('Invalid OpenAI API key format. Key should start with "sk-"');
		}

		if (anthropicApiKey && !anthropicApiKey.startsWith('sk-ant-')) {
			throw new OperationalError('Invalid Anthropic API key format. Key should start with "sk-ant-"');
		}

		// Setup models with available keys, fallback to the same model if only one key is available
		if (openaiApiKey) {
			this.llmSimpleTask = gpt41mini({
				apiKey: openaiApiKey,
			});
			// Use OpenAI for complex tasks if Anthropic key is not available
			this.llmComplexTask = anthropicApiKey ? anthropicClaude37Sonnet({
				apiKey: anthropicApiKey,
			}) : gpt41mini({
				apiKey: openaiApiKey,
			});
		} else if (anthropicApiKey) {
			// Use Anthropic for both if only Anthropic key is available
			this.llmSimpleTask = anthropicClaude37Sonnet({
				apiKey: anthropicApiKey,
			});
			this.llmComplexTask = anthropicClaude37Sonnet({
				apiKey: anthropicApiKey,
			});
		}
	}
	}

	private getNodeTypes(): INodeTypeDescription[] {
		const nodeTypesKeys = Object.keys(this.nodeTypes.getKnownTypes());

		const nodeTypes = nodeTypesKeys
			.map((nodeName) => {
				return { ...this.nodeTypes.getByNameAndVersion(nodeName).description, name: nodeName };
			})
			.filter((nodeType) => nodeType.hidden !== true);

		return nodeTypes;
	}

	private isWorkflowEvent(eventName: string): boolean {
		return [
			'prompt_validation',
			'generated_steps',
			'generated_nodes',
			'composed_nodes',
			'composed_connections',
			'generated_workflow_json',
		].includes(eventName);
	}

	private getAgent() {
		const validatorChainNode = async (
			state: typeof WorkflowState.State,
			config: RunnableConfig,
		): Promise<Partial<typeof WorkflowState.State>> => {
			assert(this.llmSimpleTask, 'LLM not setup');

			const isWorkflowPrompt = await validatorChain(this.llmSimpleTask).invoke(
				{
					prompt: state.prompt,
				},
				config,
			);

			if (!isWorkflowPrompt) {
				await dispatchCustomEvent('prompt_validation', {
					role: 'assistant',
					type: 'prompt-validation',
					isWorkflowPrompt,
					id: Date.now().toString(),
				});
			}

			return {
				isWorkflowPrompt,
			};
		};

		const plannerChainNode = async (
			state: typeof WorkflowState.State,
			config: RunnableConfig,
		): Promise<Partial<typeof WorkflowState.State>> => {
			assert(this.llmComplexTask, 'LLM not setup');

			const steps = await plannerChain(this.llmComplexTask).invoke(
				{
					prompt: state.prompt,
				},
				config,
			);

			await dispatchCustomEvent('generated_steps', {
				role: 'assistant',
				type: 'workflow-step',
				steps,
				id: Date.now().toString(),
				read: false,
			});

			return {
				steps,
			};
		};

		const nodeSelectionChainNode = async (
			state: typeof WorkflowState.State,
			config: RunnableConfig,
		) => {
			assert(this.llmSimpleTask, 'LLM not setup');

			const getNodeMessage = (node: INodeTypeDescription) => {
				return `
					<node_name>${node.name}</node_name>
					<node_description>${node.description}</node_description>
				`;
			};

			const allowedNodes = this.parsedNodeTypes.map(getNodeMessage).join('');
			const result = await nodesSelectionChain(this.llmSimpleTask).invoke(
				{
					allowedNodes,
					prompt: state.prompt,
					steps: state.steps.join('\n'),
				},
				config,
			);

			const nodes = [...new Set(result.map((r) => r.node))];

			await dispatchCustomEvent('generated_nodes', {
				role: 'assistant',
				type: 'workflow-node',
				nodes,
				id: Date.now().toString(),
				read: false,
			});

			return {
				nodes,
			};
		};

		const nodesComposerChainNode = async (
			state: typeof WorkflowState.State,
			config: RunnableConfig,
		) => {
			assert(this.llmComplexTask, 'LLM not setup');
			const getLatestVersion = (nodeType: string) => {
				const node = this.parsedNodeTypes.find((n) => n.name === nodeType);
				if (!node) {
					throw new OperationalError(`Node type not found: ${nodeType}`);
				}

				if (node.defaultVersion) {
					return node.defaultVersion;
				}

				return typeof node.version === 'number'
					? node.version
					: node.version[node.version.length - 1];
			};
			const getNodeMessage = (nodeName: string) => {
				const node = this.parsedNodeTypes.find((n) => n.name === nodeName);
				if (!node) {
					throw new OperationalError(`Node type not found: ${nodeName}`);
				}
				return `
					<node_name>
						${node.name}
					</node_name>
					<node_description>
						${node.description}
					</node_description>
					<node_parameters>
						${JSON.stringify(node.properties)}
					</node_parameters>
				`;
			};

			const result = await nodesComposerChain(this.llmComplexTask).invoke(
				{
					user_workflow_prompt: state.prompt,
					nodes: state.nodes.map(getNodeMessage).join('\n\n'),
				},
				config,
			);

			const composedNodes = result.map((node, index) => {
				const version = getLatestVersion(node.type);
				return {
					...node,
					position: [index * 150, 0],
					typeVersion: version,
				};
			});

			await dispatchCustomEvent('composed_nodes', {
				role: 'assistant',
				type: 'workflow-composed',
				nodes: composedNodes,
				id: Date.now().toString(),
				read: false,
			});

			return {
				workflowJSON: {
					nodes: composedNodes,
					connections: {},
				},
			};
		};

		const connectionComposerChainNode = async (
			state: typeof WorkflowState.State,
			config: RunnableConfig,
		) => {
			assert(this.llmComplexTask, 'LLM not setup');
			// Pass the selected nodes as input to create connections.
			const getNodeMessage = (node: INode) => {
				return `
					<node>
						${JSON.stringify(node)}
					</node>
				`;
			};
			const connections = await connectionComposerChain(this.llmComplexTask).invoke(
				{
					workflowJSON: state.workflowJSON.nodes.map(getNodeMessage).join('\n\n'),
				},
				config,
			);
			const workflowJSON = {
				...state.workflowJSON,
				connections,
			};

			await dispatchCustomEvent('composed_connections', {
				role: 'assistant',
				type: 'workflow-connections',
				workflowJSON,
				id: Date.now().toString(),
				read: false,
			});

			return {
				workflowJSON,
			};
		};

		///////////////////// Finalization /////////////////////
		// Finalize the workflow JSON by combining nodes and their connections.
		async function generateWorkflowJSON(state: typeof WorkflowState.State) {
			await dispatchCustomEvent('generated_workflow_json', {
				role: 'assistant',
				type: 'workflow-generated',
				codeSnippet: JSON.stringify(state.workflowJSON, null, 4),
			});
			return { workflowJSON: JSON.stringify(state.workflowJSON, null, 2) };
		}

		///////////////////// Workflow Graph Definition /////////////////////
		const workflowGraph = new StateGraph(WorkflowState)
			.addNode('validator', validatorChainNode)
			.addNode('planner', plannerChainNode)
			.addNode('node_selector', nodeSelectionChainNode)
			.addNode('nodes_composer', nodesComposerChainNode)
			.addNode('connection_composer', connectionComposerChainNode)
			.addNode('finalize', generateWorkflowJSON);

		// Define the graph edges to set the processing order:
		// Start with the validator
		workflowGraph.addEdge(START, 'validator');
		// If validated, continue to planner
		workflowGraph.addConditionalEdges('validator', (state) => {
			return state.isWorkflowPrompt ? 'planner' : END;
		});
		// Planner node flows into node selector:
		workflowGraph.addEdge('planner', 'node_selector');
		// Node selector is followed by nodes composer:
		workflowGraph.addEdge('node_selector', 'nodes_composer');
		// Nodes composer is followed by connection composer:
		workflowGraph.addEdge('nodes_composer', 'connection_composer');
		// Connection composer flows to finalization:
		workflowGraph.addEdge('connection_composer', 'finalize');
		// Finalization flows to end:
		workflowGraph.addEdge('finalize', END);

		return workflowGraph;
	}

	async *chat(payload: { question: string }, user: IUser) {
		if (!this.llmComplexTask || !this.llmSimpleTask) {
			await this.setupModels(user);
		}

		// Audit and sanitize the user's question for security
		const auditResult = this.promptAuditor.auditAndSanitizePrompt(payload.question);
		
		if (auditResult.warnings.length > 0) {
			// Yield security warning message
			yield {
				messages: [{
					role: 'assistant',
					type: 'security-warning',
					text: 'Some potentially unsafe content was detected and sanitized in your prompt.',
					warnings: auditResult.warnings,
				}],
			};
		}

		const agent = this.getAgent().compile();

		const initialState: typeof WorkflowState.State = {
			messages: [],
			prompt: auditResult.sanitized, // Use sanitized prompt
			steps: [],
			nodes: [],
			workflowJSON: { nodes: [], connections: {} },
			isWorkflowPrompt: false,
			next: 'PLAN',
		};

		const stream = agent.streamEvents(initialState, {
			streamMode: 'custom',
			recursionLimit: 10,
			version: 'v2',
		});

		for await (const chunk of stream) {
			let messageChunk: MessageResponse;
			if (chunk.event === 'on_custom_event') {
				if (this.isWorkflowEvent(chunk.name)) {
					messageChunk = chunk.data as MessageResponse;
					
					// Audit generated workflow JSON for security if it's the final result
					if (chunk.name === 'generated_workflow_json' && messageChunk.type === 'workflow-generated') {
						try {
							const workflowJson = JSON.parse(messageChunk.codeSnippet || '{}');
							const securityAudit = this.promptAuditor.auditWorkflowJson(workflowJson);
							
							if (!securityAudit.isSecure) {
								// Yield security warning for workflow
								yield {
									messages: [{
										role: 'assistant',
										type: 'security-warning',
										text: 'Security issues detected in generated workflow. Please review before use.',
										warnings: securityAudit.warnings,
									}],
								};
							}
						} catch (error) {
							// If JSON parsing fails, log but don't block
							console.warn('Failed to parse workflow JSON for security audit:', error);
						}
					}
				} else {
					messageChunk = {
						role: 'assistant',
						type: 'intermediate-step',
						text: chunk.data as string,
						step: chunk.name,
					};
				}
				yield { messages: [messageChunk] };
			}
		}
	}
}
