import { Config, Env } from '../decorators';

@Config
export class TemplatesConfig {
	/** Whether to load workflow templates. */
	@Env('GLOW_TEMPLATES_ENABLED')
	enabled: boolean = true;

	/** Host to retrieve workflow templates from endpoints. */
	@Env('GLOW_TEMPLATES_HOST')
	host: string = 'https://api.n8n.io/api/';
}
