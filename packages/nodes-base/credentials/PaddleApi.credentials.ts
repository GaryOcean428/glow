import type { ICredentialType, INodeProperties } from 'glow-workflow';

export class PaddleApi implements ICredentialType {
	name = 'paddleApi';

	displayName = 'Paddle API';

	documentationUrl = 'paddle';

	properties: INodeProperties[] = [
		{
			displayName: 'Vendor Auth Code',
			name: 'vendorAuthCode',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Vendor ID',
			name: 'vendorId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Use Sandbox Environment API',
			name: 'sandbox',
			type: 'boolean',
			default: false,
		},
	];
}
