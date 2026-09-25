// Typed client for the standalone server's action API.
//
// `api.<actionName>(args)` POSTs `{ action, args }` to the same-origin
// `./actions` endpoint and resolves with the action's typed response
// (or throws on error). Action names and arg/response shapes come from
// the server's action definitions, so client and server stay in sync.
import { createActionClient } from "./sdk-shim";
import type { ApiRequest, ActionEnvelope, ApiResponse } from "./sdk-shim";
import type { Actions as ActionsValue } from "../../server/src/actions";

type Actions = typeof ActionsValue;

export const api = createActionClient<Actions>();

export type { ApiRequest, ActionEnvelope, ApiResponse };
