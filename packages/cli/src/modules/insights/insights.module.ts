import type { BaseN8nModule } from '@glow/decorators';
import { N8nModule } from '@glow/decorators';

import { InsightsService } from './insights.service';

import './insights.controller';

@N8nModule()
export class InsightsModule implements BaseN8nModule {
	constructor(private readonly insightsService: InsightsService) {}

	initialize() {
		this.insightsService.startTimers();
	}
}
