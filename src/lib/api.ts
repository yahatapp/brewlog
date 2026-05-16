import { hc } from "hono/client";
import type { AppType } from "@/api";

export const getApiClient = (token?: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return hc<AppType>("/", {
    headers,
  }).api;
};

// For backward compatibility or simple cases
export const api = hc<AppType>("/").api;
