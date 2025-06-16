import { inject } from 'vue';

import { ChatSymbol } from '@glow/chat/constants';
import type { Chat } from '@glow/chat/types';

export function useChat() {
	return inject(ChatSymbol) as Chat;
}
