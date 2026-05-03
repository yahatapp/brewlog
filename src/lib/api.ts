import { hc } from "hono/client";
import type { AppType } from "../../functions/api/[[route]]";

// Use the current origin for the API client
// In development, Vite proxy can handle this, or we can use an environment variable.
const client = hc<AppType>("/");

export const api = client.api;
