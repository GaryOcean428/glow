import { ApplicationError } from 'glow-workflow';

export class TaskCancelledError extends ApplicationError {
	constructor(reason: string) {
		super(`Task cancelled: ${reason}`, { level: 'warning' });
	}
}
