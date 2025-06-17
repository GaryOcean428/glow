import type { Workflow, IWorkflowBase } from 'glow-workflow';
import { UnexpectedError } from 'glow-workflow';

export class WorkflowMissingIdError extends UnexpectedError {
	constructor(workflow: Workflow | IWorkflowBase) {
		super('Detected ID-less worklfow', { extra: { workflow } });
	}
}
