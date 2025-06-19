import { DatabaseConfig, InstanceSettingsConfig } from '@glow/config';
import {
	entities,
	subscribers,
	mysqlMigrations,
	postgresMigrations,
	sqliteMigrations,
} from '@glow/db';
import { Service } from '@glow/di';
import type { 
	DataSourceOptions, 
	LoggerOptions,
	MysqlConnectionOptions,
	PostgresConnectionOptions,
	SqliteConnectionOptions
} from '@glow/typeorm';
import type { SqlitePooledConnectionOptions } from '@glow/typeorm';

// Custom data source options that includes our sqlite-pooled driver
export type GlowDataSourceOptions = DataSourceOptions | SqlitePooledConnectionOptions;
import { UserError } from 'glow-workflow';
import path from 'path';
import type { TlsOptions } from 'tls';

import { InsightsByPeriod } from '@/modules/insights/database/entities/insights-by-period';
import { InsightsMetadata } from '@/modules/insights/database/entities/insights-metadata';
import { InsightsRaw } from '@/modules/insights/database/entities/insights-raw';

@Service()
export class DbConnectionOptions {
	constructor(
		private readonly config: DatabaseConfig,
		private readonly instanceSettingsConfig: InstanceSettingsConfig,
	) {}

	getOverrides(dbType: 'postgresdb' | 'mysqldb') {
		const dbConfig = this.config[dbType];
		return {
			database: dbConfig.database,
			host: dbConfig.host,
			port: dbConfig.port,
			username: dbConfig.user,
			password: dbConfig.password,
		};
	}

	getOptions(): GlowDataSourceOptions {
		const { type: dbType } = this.config;
		switch (dbType) {
			case 'sqlite':
				return this.getSqliteConnectionOptions();
			case 'postgresdb':
				return this.getPostgresConnectionOptions();
			case 'mariadb':
			case 'mysqldb':
				return this.getMysqlConnectionOptions(dbType);
			default:
				throw new UserError('Database type currently not supported', { extra: { dbType } });
		}
	}

	private getCommonOptions() {
		const { tablePrefix: entityPrefix, logging: loggingConfig } = this.config;

		let loggingOption: LoggerOptions = loggingConfig.enabled;
		if (loggingOption) {
			const optionsString = loggingConfig.options.replace(/\s+/g, '');
			if (optionsString === 'all') {
				loggingOption = optionsString;
			} else {
				loggingOption = optionsString.split(',') as LoggerOptions;
			}
		}

		return {
			entityPrefix,
			entities: [...Object.values(entities), InsightsRaw, InsightsByPeriod, InsightsMetadata],
			subscribers: Object.values(subscribers),
			migrationsTableName: `${entityPrefix}migrations`,
			migrationsRun: false,
			synchronize: false,
			maxQueryExecutionTime: loggingConfig.maxQueryExecutionTime,
			logging: loggingOption,
		};
	}

	private getSqliteConnectionOptions(): SqliteConnectionOptions | SqlitePooledConnectionOptions {
		const { sqlite: sqliteConfig } = this.config;
		const { n8nFolder } = this.instanceSettingsConfig;

		const commonOptions = {
			...this.getCommonOptions(),
			database: path.resolve(n8nFolder, sqliteConfig.database),
			migrations: sqliteMigrations,
		};

		if (sqliteConfig.poolSize > 0) {
			return {
				type: 'sqlite-pooled' as const,
				poolSize: sqliteConfig.poolSize,
				enableWAL: true,
				acquireTimeout: 60_000,
				destroyTimeout: 5_000,
				...commonOptions,
			} as SqlitePooledConnectionOptions;
		} else {
			return {
				type: 'sqlite' as const,
				enableWAL: sqliteConfig.enableWAL,
				...commonOptions,
			} as SqliteConnectionOptions;
		}
	}

	private getPostgresConnectionOptions(): PostgresConnectionOptions {
		const { postgresdb: postgresConfig } = this.config;
		const {
			ssl: { ca: sslCa, cert: sslCert, key: sslKey, rejectUnauthorized: sslRejectUnauthorized },
		} = postgresConfig;

		let ssl: TlsOptions | boolean = postgresConfig.ssl.enabled;
		if (sslCa !== '' || sslCert !== '' || sslKey !== '' || !sslRejectUnauthorized) {
			ssl = {
				ca: sslCa || undefined,
				cert: sslCert || undefined,
				key: sslKey || undefined,
				rejectUnauthorized: sslRejectUnauthorized,
			};
		}

		return {
			type: 'postgres' as const,
			...this.getCommonOptions(),
			...this.getOverrides('postgresdb'),
			schema: postgresConfig.schema,
			poolSize: postgresConfig.poolSize,
			migrations: postgresMigrations,
			connectTimeoutMS: postgresConfig.connectionTimeoutMs,
			ssl,
			extra: {
				idleTimeoutMillis: postgresConfig.idleTimeoutMs,
			},
		} as PostgresConnectionOptions;
	}

	private getMysqlConnectionOptions(dbType: 'mariadb' | 'mysqldb'): MysqlConnectionOptions {
		return {
			type: dbType === 'mysqldb' ? ('mysql' as const) : ('mariadb' as const),
			...this.getCommonOptions(),
			...this.getOverrides('mysqldb'),
			migrations: mysqlMigrations,
			timezone: 'Z', // set UTC as default
		} as MysqlConnectionOptions;
	}
}
