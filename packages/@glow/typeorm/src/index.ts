// Re-export everything from typeorm
export * from 'typeorm';

// Re-export driver-specific connection options
export type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
export type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export type { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

// Re-export query builder types
export type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Re-export our custom types
export type { SqlitePooledConnectionOptions } from './driver/sqlite-pooled/SqlitePooledConnectionOptions';