import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { InsightsMetadata } from '../entities/insights-metadata';

@Service()
export class InsightsMetadataRepository extends Repository<InsightsMetadata> {
	constructor(dataSource: DataSource) {
		super(InsightsMetadata, dataSource.manager);
	}
}
