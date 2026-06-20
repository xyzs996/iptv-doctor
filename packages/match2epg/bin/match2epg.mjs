#!/usr/bin/env node
const { runMatch2EpgCli } = await import("../dist/cli.js");

try {
  runMatch2EpgCli();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
