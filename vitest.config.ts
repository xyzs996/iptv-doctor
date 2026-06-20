import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    conditions: ["source"],
    alias: {
      "iptv-doctor-core": resolve(import.meta.dirname, "packages/iptv-core/src/index.ts"),
      "iptv-sports-data": resolve(import.meta.dirname, "packages/sports-data/src/index.ts"),
      "@bjia666/match2epg": resolve(import.meta.dirname, "packages/match2epg/src/index.ts")
    }
  },
  test: {
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
    environment: "node"
  }
});
