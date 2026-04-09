import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "customTitle" TEXT,
    "subspecialty" TEXT,
    "residencyProgram" TEXT,
    "sessionDate" DATETIME NOT NULL,
    "chiefComplaint" TEXT,
    "youtubeUrl" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "originalFileName" TEXT,
    "sanitizedFileName" TEXT,
    "fileMimeType" TEXT,
    "fileExtension" TEXT,
    "storagePath" TEXT,
    "previewImagePath" TEXT,
    "previewImageMimeType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "SubmissionPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "linkType" TEXT NOT NULL,
    "handleOrUrl" TEXT,
    "normalizedUrl" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubmissionPerson_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Submission_slug_key" ON "Submission"("slug")`,
  `CREATE INDEX IF NOT EXISTS "SubmissionPerson_submissionId_role_sortOrder_idx" ON "SubmissionPerson"("submissionId", "role", "sortOrder")`,
];

async function main() {
  for (const sql of statements) {
    console.log("Executing:", sql.slice(0, 60) + "...");
    await client.execute(sql);
  }
  console.log("Schema pushed to Turso successfully.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
