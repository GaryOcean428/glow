import { GlobalConfig } from '@glow/config';
import { DateTimeColumn } from '@glow/db';
import { Container } from '@glow/di';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@glow/typeorm';
import { UnexpectedError } from 'glow-workflow';

import { isValidTypeNumber, NumberToType, TypeToNumber } from './insights-shared';

export const { type: dbType } = Container.get(GlobalConfig).database;

@Entity()
export class InsightsRaw extends BaseEntity {
	constructor() {
		super();
		this.timestamp = new Date();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	metaId: number;

	@Column({ name: 'type', type: 'int' })
	private type_: number;

	get type() {
		if (!isValidTypeNumber(this.type_)) {
			throw new UnexpectedError(
				`Type '${this.type_}' is not a valid type for 'InsightsByPeriod.type'`,
			);
		}

		return NumberToType[this.type_];
	}

	set type(value: keyof typeof TypeToNumber) {
		this.type_ = TypeToNumber[value];
	}

	@Column()
	value: number;

	@DateTimeColumn({ name: 'timestamp' })
	timestamp: Date;
}
