import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { AnnotationTagEntity } from '../entities';

@Service()
export class AnnotationTagRepository extends Repository<AnnotationTagEntity> {
	constructor(dataSource: DataSource) {
		super(AnnotationTagEntity, dataSource.manager);
	}
}
