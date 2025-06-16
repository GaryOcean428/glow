import { UserError } from 'glow-workflow';

export class UnrecognizedCredentialTypeError extends UserError {
	constructor(credentialType: string) {
		super(`Unrecognized credential type: ${credentialType}`);
	}
}
