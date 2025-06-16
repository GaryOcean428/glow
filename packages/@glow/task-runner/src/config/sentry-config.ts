import { Config, Env } from '@n8n/config';

@Config
export class SentryConfig {
	/** Sentry DSN (data source name) */
	@Env('GLOW_SENTRY_DSN')
	dsn: string = '';

	//#region Metadata about the environment

	@Env('GLOW_VERSION')
	n8nVersion: string = '';

	@Env('ENVIRONMENT')
	environment: string = '';

	@Env('DEPLOYMENT_NAME')
	deploymentName: string = '';

	//#endregion
}
