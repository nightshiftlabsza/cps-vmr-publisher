import path from "node:path";

export function getEnv() {
  return {
    databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
    storageRoot: path.resolve(process.cwd(), process.env.STORAGE_ROOT ?? "./storage"),
    appBaseUrl: (process.env.APP_BASE_URL ?? "http://localhost:3000").replace(
      /\/+$/,
      "",
    ),
    // Auth
    authPassword: process.env.AUTH_PASSWORD,
    authSecret: process.env.AUTH_SECRET,
    // Turso (production database)
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    // Vercel Blob (production storage)
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
  };
}
