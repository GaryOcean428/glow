import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { AuthProviderSyncHistory } from '../entities';

@Service()
export class AuthProviderSyncHistoryRepository extends Repository<AuthProviderSyncHistory> {
	constructor(dataSource: DataSource) {
		super(AuthProviderSyncHistory, dataSource.manager);
	}
}
