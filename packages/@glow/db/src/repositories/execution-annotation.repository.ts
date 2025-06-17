import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { ExecutionAnnotation } from '../entities';

@Service()
export class ExecutionAnnotationRepository extends Repository<ExecutionAnnotation> {
	constructor(dataSource: DataSource) {
		super(ExecutionAnnotation, dataSource.manager);
	}
}
