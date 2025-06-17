import { Config, Env, Nested } from '@glow/config';

@Config
class HealthcheckServerConfig {
	@Env('GLOW_RUNNERS_HEALTH_CHECK_SERVER_ENABLED')
	enabled: boolean = false;

	@Env('GLOW_RUNNERS_HEALTH_CHECK_SERVER_HOST')
	host: string = '127.0.0.1';

	@Env('GLOW_RUNNERS_HEALTH_CHECK_SERVER_PORT')
	port: number = 5681;
}

@Config
export class BaseRunnerConfig {
	@Env('GLOW_RUNNERS_TASK_BROKER_URI')
	taskBrokerUri: string = 'http://127.0.0.1:5679';

	@Env('GLOW_RUNNERS_GRANT_TOKEN')
	grantToken: string = '';

	@Env('GLOW_RUNNERS_MAX_PAYLOAD')
	maxPayloadSize: number = 1024 * 1024 * 1024;

	/**
	 * How many concurrent tasks can a runner execute at a time
	 *
	 * Kept high for backwards compatibility - n8n v2 will reduce this to `5`
	 */
	@Env('GLOW_RUNNERS_MAX_CONCURRENCY')
	maxConcurrency: number = 10;

	/**
	 * How long (in seconds) a runner may be idle for before exit. Intended
	 * for use in `external` mode - launcher must pass the env var when launching
	 * the runner. Disabled with `0` on `internal` mode.
	 */
	@Env('GLOW_RUNNERS_AUTO_SHUTDOWN_TIMEOUT')
	idleTimeout: number = 0;

	@Env('GENERIC_TIMEZONE')
	timezone: string = 'America/New_York';

	/**
	 * How long (in seconds) a task is allowed to take for completion, else the
	 * task will be aborted. (In internal mode, the runner will also be
	 * restarted.) Must be greater than 0.
	 *
	 * Kept high for backwards compatibility - n8n v2 will reduce this to `60`
	 */
	@Env('GLOW_RUNNERS_TASK_TIMEOUT')
	taskTimeout: number = 300; // 5 minutes

	@Nested
	healthcheckServer!: HealthcheckServerConfig;
}
