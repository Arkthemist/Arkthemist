import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";
import path from "path";
// import { SupabaseDatabaseAdapter } from "@elizaos/adapter-supabase";

export function initializeDatabase(dataDir: string) {
  if (process.env.POSTGRES_URL) {
    // if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_API_KEY) {
    //   // const db = new SupabaseDatabaseAdapter(
    //   //   process.env.SUPABASE_URL,
    //   //   process.env.SUPABASE_SERVICE_API_KEY,
    //   // );
    //   // return db;
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else {
    const filePath =
      process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    // ":memory:";
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    return db;
  }
}
