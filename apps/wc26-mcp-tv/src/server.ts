#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { generateXMLTV } from "@iptv-star/match2epg";
import { getWorldCup2026Dataset } from "@iptv-star/sports-data";

const dataset = getWorldCup2026Dataset();

export function createServer(): McpServer {
  const server = new McpServer({
    name: "wc26-mcp-tv",
    version: "0.1.0"
  });

  server.registerTool(
    "list_worldcup_matches",
    {
      description: "List sample FIFA World Cup 2026 matches from the local metadata dataset."
    },
    async () => ({
      content: [
        {
          type: "text",
          text: dataset.fixtures
            .map((fixture) => `${fixture.id}: ${fixture.homeTeam} vs ${fixture.awayTeam} at ${fixture.kickoffUtc}`)
            .join("\n")
        }
      ]
    })
  );

  server.registerTool(
    "us_legal_viewing_paths",
    {
      description: "Return US legal viewing metadata stored by this project."
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(dataset.broadcasters.US?.channels ?? [], null, 2)
        }
      ]
    })
  );

  server.registerTool(
    "generate_us_xmltv",
    {
      description: "Generate XMLTV metadata for the US World Cup channel mapping."
    },
    async () => ({
      content: [
        {
          type: "text",
          text: generateXMLTV(dataset, "US")
        }
      ]
    })
  );

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
