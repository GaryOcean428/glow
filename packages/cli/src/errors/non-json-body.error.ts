import { UserError } from 'glow-workflow';

export class NonJsonBodyError extends UserError {
	constructor() {
		super('Body must be valid JSON. Please make sure `content-type` is `application/json`.');
	}
}
