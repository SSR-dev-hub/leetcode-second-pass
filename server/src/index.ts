// Standalone HTTP server for LeetCode Second Pass.
// - Serves POST /actions (same-origin action dispatcher replacing the
//   platform's action transport).
// - Serves note images from the local blob store at /blobs/*.
// - Serves the built client from client/dist when present.
import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { openDatabase } from "./db.js";
import { blobPathForKey, contentTypeForKey, createBlobClient } from "./blobs.js";
import { Actions } from "./actions.js";
import type { ActionCtx } from "./sdk-shim.js";
import { z } from "zod";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), "data");
const CLIENT_DIST = process.env.CLIENT_DIST || join(process.cwd(), "client", "dist");

const db = openDatabase(DATA_DIR);
const blobs = createBlobClient(DATA_DIR);

const ctx: ActionCtx = {
  db: () => db,
  blobs,
  agent: {
    // No agent runtime exists outside the Hatch platform, so automatic
    // YouTube catalog discovery is unavailable. Callers already handle
    // `{ ok: false }` by marking the catalog lookup failed instead of
    // hanging; users can still paste video URLs manually. See README.
    async spawnTask() {
      return { ok: false };
    },
  },
  invalidateQueries() {
    // No-op: the browser client invalidates its own react-query cache.
  },
};

const app = express();
app.use(express.json({ limit: "25mb" }));

// Erased signature for the dynamic dispatch boundary; each action's own
// request/response schemas still validate both sides of the call.
interface AnyAction {
  request: z.ZodType;
  response: z.ZodType;
  handler: (ctx: ActionCtx, args: any) => Promise<any>;
}

app.post("/actions", async (req, res) => {
  const { action, args } = (req.body ?? {}) as { action?: string; args?: unknown };
  const def = (Actions as unknown as Record<string, AnyAction | undefined>)[action ?? ""];
  if (!action || !def) {
    res.status(404).json({ error: `Unknown action: ${action ?? "(missing)"}` });
    return;
  }
  const parsedArgs = def.request.safeParse(args);
  if (!parsedArgs.success) {
    res.status(400).json({ error: `Invalid arguments for ${action}: ${parsedArgs.error.message}` });
    return;
  }
  try {
    const data = await def.handler(ctx, parsedArgs.data);
    const parsedRes = def.response.safeParse(data);
    if (!parsedRes.success) {
      console.error(`Action ${action} returned an invalid response:`, parsedRes.error.message);
      res.status(500).json({ error: `Internal error in action ${action}.` });
      return;
    }
    res.json({ data: parsedRes.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Action ${action} failed:`, message);
    res.status(500).json({ error: message });
  }
});

app.get(/^\/blobs\/(.+)$/, (req, res) => {
  const key = req.params[0];
  const blobsDir = join(DATA_DIR, "blobs");
  const target = blobPathForKey(blobsDir, key);
  if (!target || !existsSync(target)) {
    res.status(404).send("Not found");
    return;
  }
  res.type(contentTypeForKey(key));
  res.send(readFileSync(target));
});

if (existsSync(join(CLIENT_DIST, "index.html"))) {
  app.use(express.static(CLIENT_DIST, { index: false }));
  app.get(/.*/, (_req, res) => {
    res.sendFile(join(CLIENT_DIST, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res
      .status(404)
      .type("text/plain")
      .send("Client not built. Run `npm run build` (production) or `npm run dev:client` (development).");
  });
}

app.listen(PORT, () => {
  console.log(`LeetCode Second Pass listening on http://localhost:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
