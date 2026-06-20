#!/usr/bin/env node
const { runIptvDoctorCli } = await import("../dist/cli.js");

runIptvDoctorCli().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
