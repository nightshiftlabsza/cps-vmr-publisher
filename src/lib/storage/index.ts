import { LocalStorageService } from "@/lib/storage/local-storage-service";
import { VercelBlobStorageService } from "@/lib/storage/vercel-blob-storage-service";

export function getStorageService() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobStorageService();
  }
  return new LocalStorageService();
}
