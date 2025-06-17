import { Entity, PrimaryColumn } from '@glow/typeorm';
import { MessageEventBusDestinationOptions } from 'glow-workflow';

import { JsonColumn, WithTimestamps } from './abstract-entity';

@Entity({ name: 'event_destinations' })
export class EventDestinations extends WithTimestamps {
	@PrimaryColumn('uuid')
	id: string;

	@JsonColumn()
	destination: MessageEventBusDestinationOptions;
}
