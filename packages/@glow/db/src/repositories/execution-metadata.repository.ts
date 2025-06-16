import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { ExecutionMetadata } from '../entities';

@Service()
export class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {
	constructor(dataSource: DataSource) {
		super(ExecutionMetadata, dataSource.manager);
	}
}
