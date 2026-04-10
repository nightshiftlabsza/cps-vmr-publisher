import { LocalStorageService } from "@/lib/storage/local-storage-service";
import { VercelBlobStorageService } from "@/lib/storage/vercel-blob-storage-service";

export function getStorageService() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobStorageService();
  }

  // Vercel serverless has a read-only filesystem — local storage won't work
  if (process.env.VERCEL) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add Vercel Blob storage to this project: Vercel Dashboard → Storage → Create Store → Blob",
    );
  }

  return new LocalStorageService();
}
