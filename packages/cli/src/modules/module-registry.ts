import type { LifecycleContext } from '@glow/decorators';
import { LifecycleMetadata, ModuleMetadata } from '@glow/decorators';
import { Container, Service } from '@glow/di';
import type { ExecutionLifecycleHooks } from 'glow-core';
import type {
	IDataObject,
	IRun,
	IRunExecutionData,
	ITaskData,
	ITaskStartedData,
	IWorkflowBase,
	Workflow,
} from 'glow-workflow';

@Service()
export class ModuleRegistry {
	constructor(
		private readonly moduleMetadata: ModuleMetadata,
		private readonly lifecycleMetadata: LifecycleMetadata,
	) {}

	async initializeModules() {
		for (const ModuleClass of this.moduleMetadata.getModules()) {
			await Container.get(ModuleClass).initialize?.();
		}
	}

	registerLifecycleHooks(hooks: ExecutionLifecycleHooks) {
		const handlers = this.lifecycleMetadata.getHandlers();

		for (const { handlerClass, methodName, eventName } of handlers) {
			const instance = Container.get(handlerClass);

			switch (eventName) {
				case 'workflowExecuteAfter':
					hooks.addHandler(
						eventName,
						async function (
							this: { workflowData: IWorkflowBase },
							runData: IRun,
							newStaticData: IDataObject,
						) {
							const context: LifecycleContext = {
								type: 'workflowExecuteAfter',
								workflow: this.workflowData,
								runData,
								newStaticData,
							};
							// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/return-await
							return await instance[methodName].call(instance, context);
						},
					);
					break;

				case 'nodeExecuteBefore':
					hooks.addHandler(
						eventName,
						async function (
							this: { workflowData: IWorkflowBase },
							nodeName: string,
							taskData: ITaskStartedData,
						) {
							const context: LifecycleContext = {
								type: 'nodeExecuteBefore',
								workflow: this.workflowData,
								nodeName,
								taskData,
							};

							// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/return-await
							return await instance[methodName].call(instance, context);
						},
					);
					break;

				case 'nodeExecuteAfter':
					hooks.addHandler(
						eventName,
						async function (
							this: { workflowData: IWorkflowBase },
							nodeName: string,
							taskData: ITaskData,
							executionData: IRunExecutionData,
						) {
							const context: LifecycleContext = {
								type: 'nodeExecuteAfter',
								workflow: this.workflowData,
								nodeName,
								taskData,
								executionData,
							};

							// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/return-await
							return await instance[methodName].call(instance, context);
						},
					);
					break;

				case 'workflowExecuteBefore':
					hooks.addHandler(
						eventName,
						async function (
							this: { workflowData: IWorkflowBase },
							workflowInstance: Workflow,
							executionData?: IRunExecutionData,
						) {
							const context: LifecycleContext = {
								type: 'workflowExecuteBefore',
								workflow: this.workflowData,
								workflowInstance,
								executionData,
							};

							// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/return-await
							return await instance[methodName].call(instance, context);
						},
					);
					break;
			}
		}
	}
}
