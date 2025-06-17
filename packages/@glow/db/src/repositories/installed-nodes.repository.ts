import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { InstalledNodes } from '../entities';

@Service()
export class InstalledNodesRepository extends Repository<InstalledNodes> {
	constructor(dataSource: DataSource) {
		super(InstalledNodes, dataSource.manager);
	}
}
