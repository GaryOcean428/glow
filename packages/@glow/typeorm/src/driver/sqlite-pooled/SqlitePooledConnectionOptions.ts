import type { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

/**
 * SQLite connection options with pooling support.
 * This extends the base SQLite connection options with additional pooling-related properties.
 */
export interface SqlitePooledConnectionOptions extends Omit<SqliteConnectionOptions, 'type' | 'poolSize'> {
	/**
	 * Database type. This driver provides sqlite connection with pooling.
	 */
	type: 'sqlite-pooled';

	/**
	 * Maximum number of connections in the connection pool.
	 */
	poolSize: number;

	/**
	 * Timeout for acquiring a connection from the pool (in milliseconds).
	 * @default 60000
	 */
	acquireTimeout?: number;

	/**
	 * Timeout for destroying idle connections (in milliseconds).
	 * @default 5000
	 */
	destroyTimeout?: number;

	/**
	 * Enable WAL mode for better concurrency.
	 * @default true
	 */
	enableWAL?: boolean;
}