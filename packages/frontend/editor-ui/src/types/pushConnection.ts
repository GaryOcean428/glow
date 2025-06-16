import type { PushMessage } from '@glow/api-types';

export type PushMessageQueueItem = {
	message: PushMessage;
	retriesLeft: number;
};
