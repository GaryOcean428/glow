import { Config, Env } from '@glow/config';

@Config
export class JsRunnerConfig {
	@Env('NODE_FUNCTION_ALLOW_BUILTIN')
	allowedBuiltInModules: string = '';

	@Env('NODE_FUNCTION_ALLOW_EXTERNAL')
	allowedExternalModules: string = '';

	/**
	 * Whether to allow prototype mutation for external libraries. Set to `true`
	 * to allow modules that rely on runtime prototype mutation, e.g. `puppeteer`,
	 * at the cost of security.
	 *
	 * @default false
	 */
	@Env('GLOW_RUNNERS_ALLOW_PROTOTYPE_MUTATION')
	allowPrototypeMutation: boolean = false;
}
