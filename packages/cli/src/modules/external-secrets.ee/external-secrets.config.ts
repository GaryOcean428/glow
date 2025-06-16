import { Config, Env } from '@glow/config';

@Config
export class ExternalSecretsConfig {
	/** How often (in seconds) to check for secret updates */
	@Env('GLOW_EXTERNAL_SECRETS_UPDATE_INTERVAL')
	updateInterval: number = 300;

	/** Whether to prefer GET over LIST when fetching secrets from Hashicorp Vault */
	@Env('GLOW_EXTERNAL_SECRETS_PREFER_GET')
	preferGet: boolean = false;
}
