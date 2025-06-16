import { Config, Env } from '@glow/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('GLOW_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}
