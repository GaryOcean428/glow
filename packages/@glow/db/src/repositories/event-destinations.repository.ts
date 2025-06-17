import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { EventDestinations } from '../entities';

@Service()
export class EventDestinationsRepository extends Repository<EventDestinations> {
	constructor(dataSource: DataSource) {
		super(EventDestinations, dataSource.manager);
	}
}
