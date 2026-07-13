import pg from "pg";

const { Pool } = pg;

export type QueryParameters = Array<string | number | boolean | Date | null>;

export interface Queryable {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: QueryParameters
  ): Promise<{ rows: T[] }>;
}

export interface TransactionClient extends Queryable {
  release(): void;
}

export interface TransactionalQueryable extends Queryable {
  connect(): Promise<TransactionClient>;
}

let sharedPool: pg.Pool | null = null;

export function hasDatabaseUrl(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.DATABASE_URL?.trim());
}

export function getPostgresPool(
  env: NodeJS.ProcessEnv = process.env
): pg.Pool | null {
  const connectionString = env.DATABASE_URL?.trim();

  if (!connectionString) return null;

  if (!sharedPool) {
    sharedPool = new Pool({
      connectionString,
      ssl:
        env.DATABASE_SSL === "false"
          ? false
          : {
              rejectUnauthorized:
                env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true",
            },
    });
  }

  return sharedPool;
}
