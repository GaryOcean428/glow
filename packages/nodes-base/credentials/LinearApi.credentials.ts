import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'glow-workflow';

export class LinearApi implements ICredentialType {
	name = 'linearApi';

	displayName = 'Linear API';

	documentationUrl = 'linear';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			},
		},
	};
}
