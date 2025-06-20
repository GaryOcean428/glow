import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class PlivoApi implements ICredentialType {
	name = 'plivoApi';

	displayName = 'Plivo API';

	documentationUrl = 'plivo';

	properties: INodeProperties[] = [
		{
			displayName: 'Auth ID',
			name: 'authId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
