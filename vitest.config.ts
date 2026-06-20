import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    conditions: ["source"],
    alias: {
      "@iptv-star/iptv-core": resolve(import.meta.dirname, "packages/iptv-core/src/index.ts"),
      "@iptv-star/sports-data": resolve(import.meta.dirname, "packages/sports-data/src/index.ts"),
      "@iptv-star/match2epg": resolve(import.meta.dirname, "packages/match2epg/src/index.ts")
    }
  },
  test: {
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
    environment: "node"
  }
});
