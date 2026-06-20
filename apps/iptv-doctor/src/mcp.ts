import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { generateXMLTV } from "@bjia666/match2epg";
import { getWorldCup2026Dataset } from "iptv-sports-data";

export const IPTV_DOCTOR_MCP_TOOLS = ["list_worldcup_matches", "us_legal_viewing_paths", "generate_us_xmltv"] as const;

export function createIptvDoctorMcpServer(): McpServer {
  const dataset = getWorldCup2026Dataset();
  const server = new McpServer({
    name: "iptv-doctor",
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
            .map((fixture) => `${fixture.id}: ${fixture.homeTeam} vs ${fixture.awayTeam} at ${fixture.kickoffUtc} (${fixture.status})`)
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

export async function runIptvDoctorMcpServer(): Promise<void> {
  const server = createIptvDoctorMcpServer();
  await server.connect(new StdioServerTransport());
}
