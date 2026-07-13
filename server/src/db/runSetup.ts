import { getPostgresPool } from "./postgres";
import { setupLaunchDatabase } from "./setupLaunchDatabase";

async function main() {
  const pool = getPostgresPool();

  if (!pool) {
    throw new Error("DATABASE_URL is required to set up the launch database.");
  }

  try {
    const result = await setupLaunchDatabase({ db: pool });

    console.log("Launch database setup complete.");
    for (const schema of result.appliedSchemas) {
      console.log(`- ${schema.id}: ${schema.tables.join(", ")}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Launch database setup failed.";
  console.error(message);
  process.exitCode = 1;
});
