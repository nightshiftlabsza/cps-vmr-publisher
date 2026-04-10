import { put, del } from "@vercel/blob";

import type { SaveFileInput, StorageService, StoredFile } from "./storage-service";

export class VercelBlobStorageService implements StorageService {
  async ensureRoot(): Promise<void> {
    // No-op — Vercel Blob has no root directory concept
  }

  async saveFile(input: SaveFileInput): Promise<StoredFile> {
    const path = `${input.folder}/${input.fileName}`;
    const blob = await put(path, input.buffer, {
      access: "public",
      addRandomSuffix: false,
    });

    return {
      absolutePath: blob.url,
      relativePath: blob.url,
    };
  }

  async readFile(relativePath: string): Promise<Buffer> {
    // For Vercel Blob, the relativePath IS the public URL
    const response = await fetch(relativePath);
    if (!response.ok) {
      throw new Error(`Failed to read file from blob storage: ${relativePath}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      const response = await fetch(relativePath, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }
}
