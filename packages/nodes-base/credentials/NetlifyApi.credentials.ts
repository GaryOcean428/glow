import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class NetlifyApi implements ICredentialType {
	name = 'netlifyApi';

	displayName = 'Netlify API';

	documentationUrl = 'netlify';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
