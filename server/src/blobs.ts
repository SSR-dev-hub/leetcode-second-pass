// Filesystem-backed blob store for note images. Blobs live under
// <dataDir>/blobs/<key> and are served by the HTTP server at /blobs/<key>.
// Keys are generated server-side (note-images/<problemId>/<marker>.<ext>),
// so path traversal is not a concern; the HTTP layer still normalizes.
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, normalize, sep } from "node:path";
import type { BlobClient } from "./sdk-shim.js";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function contentTypeForKey(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  for (const [mime, mapped] of Object.entries(MIME_TO_EXT)) {
    if (mapped === ext) return mime;
  }
  return "application/octet-stream";
}

/** Resolve a blob key to a file path, rejecting anything outside the dir. */
export function blobPathForKey(blobsDir: string, key: string): string | null {
  const normalized = normalize(key).replace(/^(\.\.[/\\])+/, "");
  const resolved = join(blobsDir, normalized);
  if (!resolved.startsWith(blobsDir + sep) && resolved !== blobsDir) return null;
  return resolved;
}

export function createBlobClient(dataDir: string): BlobClient {
  const blobsDir = join(dataDir, "blobs");
  mkdirSync(blobsDir, { recursive: true });
  return {
    async put(key: string, bytes: Buffer, _options: { contentType: string }) {
      const target = blobPathForKey(blobsDir, key);
      if (!target) throw new Error("Invalid blob key.");
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, bytes);
    },
    async delete(key: string) {
      const target = blobPathForKey(blobsDir, key);
      if (!target || !existsSync(target)) return;
      rmSync(target);
    },
    async getUrl(key: string) {
      return `/blobs/${key.split("/").map(encodeURIComponent).join("/")}`;
    },
  };
}
