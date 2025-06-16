import { inject } from 'vue';

import { ChatOptionsSymbol } from '@glow/chat/constants';
import type { ChatOptions } from '@glow/chat/types';

export function useOptions() {
	const options = inject(ChatOptionsSymbol) as ChatOptions;

	return {
		options,
	};
}
