import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class EventbriteApi implements ICredentialType {
	name = 'eventbriteApi';

	displayName = 'Eventbrite API';

	documentationUrl = 'eventbrite';

	properties: INodeProperties[] = [
		{
			displayName: 'Private Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
