import raw from "./spec.json";
import type { ChatSpec } from "./types";

/**
 * The deterministic chat spec. Prices live under `commercial_catalog` in
 * spec.json; edit them there and nowhere else.
 */
export const chatSpec = raw as unknown as ChatSpec;
