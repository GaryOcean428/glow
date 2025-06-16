import { WorkflowRepository } from '@glow/db';
import { Service } from '@glow/di';
import { UnexpectedError, type IWorkflowBase, type IWorkflowLoader } from 'glow-workflow';

@Service()
export class WorkflowLoaderService implements IWorkflowLoader {
	constructor(private readonly workflowRepository: WorkflowRepository) {}

	async get(workflowId: string): Promise<IWorkflowBase> {
		const workflow = await this.workflowRepository.findById(workflowId);

		if (!workflow) {
			throw new UnexpectedError(`Failed to find workflow with ID "${workflowId}"`);
		}

		return workflow;
	}
}
