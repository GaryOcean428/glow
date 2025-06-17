import type { INodeProperties } from 'glow-workflow';
import { updateDisplayOptions } from 'glow-workflow';

import { userLocator } from '../common';

const properties: INodeProperties[] = [
	{
		...userLocator,
		description: 'Select the user you want to retrieve',
	},
];

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
