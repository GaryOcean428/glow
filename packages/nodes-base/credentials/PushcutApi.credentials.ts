import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class PushcutApi implements ICredentialType {
	name = 'pushcutApi';

	displayName = 'Pushcut API';

	documentationUrl = 'pushcut';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
