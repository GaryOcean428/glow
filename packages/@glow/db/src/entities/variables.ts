import { Column, Entity } from '@glow/typeorm';

import { WithStringId } from './abstract-entity';

@Entity()
export class Variables extends WithStringId {
	@Column('text')
	key: string;

	@Column('text', { default: 'string' })
	type: string;

	@Column('text')
	value: string;
}
