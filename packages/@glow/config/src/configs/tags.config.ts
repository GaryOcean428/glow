import { Config, Env } from '../decorators';

@Config
export class TagsConfig {
	/*
		Disable workflow tags
	*/
	@Env('GLOW_WORKFLOW_TAGS_DISABLED')
	disabled: boolean = false;
}
