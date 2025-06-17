import { WorkflowOperationError } from 'glow-workflow';

export class WorkflowCrashedError extends WorkflowOperationError {
	constructor() {
		super('Workflow did not finish, possible out-of-memory issue');
	}
}
