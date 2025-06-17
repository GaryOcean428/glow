import type {
	AiApplySuggestionRequestDto,
	AiAskRequestDto,
	AiChatRequestDto,
} from '@glow/api-types';
import { GlobalConfig } from '@glow/config';
import { Service } from '@glow/di';
import { AiAssistantClient } from '@n8n_io/ai-assistant-sdk';
import { assert, type IUser } from 'glow-workflow';

import { GLOW_VERSION } from '../constants';
import { License } from '../license';

@Service()
export class AiService {
	private client: AiAssistantClient | undefined;

	constructor(
		private readonly licenseService: License,
		private readonly globalConfig: GlobalConfig,
	) {}

	async init() {
		const aiAssistantEnabled = this.licenseService.isAiAssistantEnabled();

		if (!aiAssistantEnabled) {
			return;
		}

		const baseUrl = this.globalConfig.aiAssistant.baseUrl;
		
		// Check if baseUrl is valid before initializing client
		if (!baseUrl || !this.isValidUrl(baseUrl)) {
			return;
		}

		const licenseCert = await this.licenseService.loadCertStr();
		const consumerId = this.licenseService.getConsumerId();
		const logLevel = this.globalConfig.logging.level;

		this.client = new AiAssistantClient({
			licenseCert,
			consumerId,
			n8nVersion: GLOW_VERSION,
			baseUrl,
			logLevel,
		});
	}

	private isValidUrl(urlString: string): boolean {
		try {
			const url = new URL(urlString);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	}

	async chat(payload: AiChatRequestDto, user: IUser) {
		if (!this.client) {
			await this.init();
		}
		assert(this.client, this.getClientNotSetupErrorMessage());

		return await this.client.chat(payload, { id: user.id });
	}

	async applySuggestion(payload: AiApplySuggestionRequestDto, user: IUser) {
		if (!this.client) {
			await this.init();
		}
		assert(this.client, this.getClientNotSetupErrorMessage());

		return await this.client.applySuggestion(payload, { id: user.id });
	}

	async askAi(payload: AiAskRequestDto, user: IUser) {
		if (!this.client) {
			await this.init();
		}
		assert(this.client, this.getClientNotSetupErrorMessage());

		return await this.client.askAi(payload, { id: user.id });
	}

	async createFreeAiCredits(user: IUser) {
		if (!this.client) {
			await this.init();
		}
		assert(this.client, this.getClientNotSetupErrorMessage());

		return await this.client.generateAiCreditsCredentials(user);
	}

	private getClientNotSetupErrorMessage(): string {
		const baseUrl = this.globalConfig.aiAssistant.baseUrl;
		
		if (!baseUrl) {
			return 'AI Assistant is not configured. Please set the GLOW_AI_ASSISTANT_BASE_URL environment variable.';
		}
		
		if (!this.isValidUrl(baseUrl)) {
			return `AI Assistant base URL is invalid: "${baseUrl}". Please provide a valid HTTP or HTTPS URL.`;
		}
		
		if (!this.licenseService.isAiAssistantEnabled()) {
			return 'AI Assistant is not enabled. Please check your license configuration.';
		}
		
		return 'AI Assistant client could not be initialized. Please check your configuration.';
	}
}
