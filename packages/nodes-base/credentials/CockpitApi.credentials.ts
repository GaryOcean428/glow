import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class CockpitApi implements ICredentialType {
	name = 'cockpitApi';

	displayName = 'Cockpit API';

	documentationUrl = 'cockpit';

	properties: INodeProperties[] = [
		{
			displayName: 'Cockpit URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://example.com',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
