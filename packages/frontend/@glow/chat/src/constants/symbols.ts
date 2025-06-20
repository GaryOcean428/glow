import type { InjectionKey } from 'vue';

import type { Chat, ChatOptions } from '@glow/chat/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChatSymbol = 'Chat' as unknown as InjectionKey<Chat>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChatOptionsSymbol = 'ChatOptions' as unknown as InjectionKey<ChatOptions>;
