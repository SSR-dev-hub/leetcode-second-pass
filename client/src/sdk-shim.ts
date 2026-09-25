// Standalone replacements for the `@hatch/space-sdk/client` imports:
// `createActionClient` (typed action RPC over same-origin POST /actions),
// `fileToBase64`/`bytesToBase64` (upload encoding helpers), and
// `spaceQueryClient` (a plain shared react-query QueryClient).
import { QueryClient } from "@tanstack/react-query";
import type { z } from "zod";

export interface ApiRequest {
  action: string;
  args: unknown;
}

/** Wire envelope returned by POST /actions. */
export interface ActionEnvelope<T = unknown> {
  data?: T;
  error?: string;
}

/**
 * Maps the server's action definitions to a typed RPC client: each action
 * name becomes `(args: <request shape>) => Promise<<response shape>>`.
 * `__actionDefs` is a phantom marker so `ApiResponse<typeof api, "name">`
 * can resolve an action's response type.
 */
export type ActionClient<
  Actions extends Record<string, { request: z.ZodType; response: z.ZodType }>,
> = {
  [K in keyof Actions]: (
    args: z.infer<Actions[K]["request"]>,
  ) => Promise<z.infer<Actions[K]["response"]>>;
} & {
  readonly __actionDefs?: Actions;
};

/** Response shape of one action: `ApiResponse<typeof api, "appData">`. */
export type ApiResponse<
  Client extends { __actionDefs?: Record<string, { request: z.ZodType; response: z.ZodType }> },
  Name extends keyof NonNullable<Client["__actionDefs"]>,
> = z.infer<NonNullable<Client["__actionDefs"]>[Name]["response"]>;

function actionError(action: string, payload: ActionEnvelope): Error {
  const detail = typeof payload?.error === "string" && payload.error ? `: ${payload.error}` : "";
  return new Error(`Action ${action} failed${detail}`);
}

/**
 * Typed client for the standalone server's POST /actions endpoint. Each
 * action becomes an async function taking the action's request args and
 * resolving with its response, mirroring the platform SDK's behavior
 * (throws on transport errors, HTTP errors, or `{ error }` payloads).
 */
export function createActionClient<
  Actions extends Record<string, { request: z.ZodType; response: z.ZodType }>,
>(): ActionClient<Actions> {
  return new Proxy({} as ActionClient<Actions>, {
    get(_target, action: string) {
      return async (args: unknown) => {
        let res: Response;
        try {
          res = await fetch("./actions", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action, args } satisfies ApiRequest),
          });
        } catch (error) {
          throw new Error(
            `Action ${action} failed: network error (${error instanceof Error ? error.message : String(error)})`,
          );
        }
        let payload: ActionEnvelope;
        try {
          payload = (await res.json()) as ActionEnvelope;
        } catch {
          throw new Error(`Action ${action} failed: invalid JSON response (HTTP ${res.status})`);
        }
        if (!res.ok || payload.error) throw actionError(action, payload);
        return payload.data;
      };
    },
  });
}

/** Shared react-query client (replaces the platform's `spaceQueryClient`). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Base64 encoding for browser file uploads (ported from the SDK's
// file-encoding helper; the naive one-liner throws RangeError on
// multi-megabyte phone photos).
export function bytesToBase64(bytes: Uint8Array): string {
  const native = bytes as Uint8Array & { toBase64?: () => string };
  if (typeof native.toBase64 === "function") return native.toBase64();
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize) as unknown as number[]);
  }
  return btoa(binary);
}

export async function fileToBase64(file: File | Blob): Promise<{ dataBase64: string; mimeType: string }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return {
    dataBase64: bytesToBase64(bytes),
    mimeType: file.type || "application/octet-stream",
  };
}
