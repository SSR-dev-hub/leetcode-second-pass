// Standalone replacement for the tiny slice of `@hatch/space-sdk` the server
// used: `defineAction`, the `zod` re-export, the action-module types, and the
// action context (`ctx`). The context here is backed by a local SQLite file
// (drizzle-orm + better-sqlite3) and a filesystem blob store instead of the
// Hatch platform services.
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import { z } from "zod";

export { z };

export type Db = BetterSQLite3Database<typeof schema>;

/** Platform-style alias, so server code written against `@hatch/space-sdk` compiles unchanged. */
export type SpaceDb = Db;

export interface BlobClient {
  /** Store bytes under a namespaced key. */
  put(key: string, bytes: Buffer, options: { contentType: string }): Promise<void>;
  /** Delete a key; missing keys are ignored. */
  delete(key: string): Promise<void>;
  /** Public URL the browser can use to render the blob. */
  getUrl(key: string): Promise<string>;
}

export interface AgentTaskResult {
  ok: boolean;
}

export interface AgentTaskOptions {
  expectsAction: string;
  allowParallel: boolean;
}

/**
 * Standalone action context. Mirrors the platform `ctx` shape used by
 * actions.ts:
 * - `ctx.db()` returns the drizzle database handle.
 * - `ctx.blobs` is a filesystem-backed blob store.
 * - `ctx.agent.spawnTask()` is NOT available outside the Hatch agent
 *   runtime, so it resolves `{ ok: false }` and callers degrade gracefully
 *   (video catalog work marks itself failed; everything else keeps working).
 * - `ctx.invalidateQueries()` is a no-op; the browser client invalidates its
 *   own react-query cache after every mutation.
 */
export interface ActionCtx {
  /** drizzle handle (typed against the app schema). */
  db(): Db;
  blobs: BlobClient;
  agent: {
    spawnTask(message: string, options: AgentTaskOptions): Promise<AgentTaskResult>;
  };
  invalidateQueries(): void;
}

export interface ActionDefinition<Req extends z.ZodType = z.ZodType, Res extends z.ZodType = z.ZodType> {
  readonly request: Req;
  readonly response: Res;
  readonly handler: (ctx: ActionCtx, args: z.infer<Req>) => Promise<z.infer<Res>>;
}

export function defineAction<Req extends z.ZodType, Res extends z.ZodType>(spec: {
  request: Req;
  response: Res;
  handler: (ctx: ActionCtx, args: z.infer<Req>) => Promise<z.infer<Res>>;
}): ActionDefinition<Req, Res> {
  return spec;
}

/** Use as `} satisfies ActionsModule;` — same as in the platform runtime. */
export type ActionsModule = Record<string, ActionDefinition>;

export type ActionRequest<A extends { request: z.ZodType }> = z.infer<A["request"]>;
export type ActionResponse<A extends { response: z.ZodType }> = z.infer<A["response"]>;
