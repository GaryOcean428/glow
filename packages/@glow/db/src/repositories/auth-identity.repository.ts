import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { AuthIdentity } from '../entities';

@Service()
export class AuthIdentityRepository extends Repository<AuthIdentity> {
	constructor(dataSource: DataSource) {
		super(AuthIdentity, dataSource.manager);
	}
}
