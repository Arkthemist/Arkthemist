import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { MongoDBDatabaseAdapter } from "@elizaos/adapter-mongodb";
import { MongoClient } from "mongodb";
import Database from "better-sqlite3";
import path from "path";

export function initializeDatabase(dataDir: string) {
  if (process.env.POSTGRES_URL) {
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else if (process.env.MONGODB_CONNECTION_STRING) {
      console.log("Initializing database on MongoDB Atlas");
      const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
          maxPoolSize: 100,
          minPoolSize: 5,
          maxIdleTimeMS: 60000,
          connectTimeoutMS: 10000,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          compressors: ["zlib"],
          retryWrites: true,
          retryReads: true,
      });

      const dbName = process.env.MONGODB_DATABASE || "elizaAgent";
      const db = new MongoDBDatabaseAdapter(client, dbName);

      // Test the connection
      db.init()
          .then(() => {
              console.log("Successfully connected to MongoDB Atlas");
          })
          .catch((error) => {
              console.log("Failed to connect to MongoDB Atlas:", error);
              throw error; // Re-throw to handle it in the calling code
          });

      return db;
  } 
  else {
    const filePath =
      process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    // ":memory:";
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    return db;
  }
}
