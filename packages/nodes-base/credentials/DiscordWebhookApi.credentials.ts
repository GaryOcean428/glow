import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class DiscordWebhookApi implements ICredentialType {
	name = 'discordWebhookApi';

	displayName = 'Discord Webhook';

	documentationUrl = 'discord';

	properties: INodeProperties[] = [
		{
			displayName: 'Webhook URL',
			name: 'webhookUri',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'https://discord.com/api/webhooks/ID/TOKEN',
			typeOptions: {
				password: true,
			},
		},
	];
}
