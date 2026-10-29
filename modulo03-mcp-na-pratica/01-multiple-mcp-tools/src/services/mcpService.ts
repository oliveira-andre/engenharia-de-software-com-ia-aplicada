import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getMongoDBTool } from "../tools/mongodbTool.ts";
import { getCSVToJSONTool } from "../tools/csvToJSONTool.ts";
import { getFSTool } from "../tools/fsTool.ts";

export const getMCPTools = async () => {
  const client = new MultiServerMCPClient({
    mcpServers: {
      ...getMongoDBTool(),
      ...getFSTool(),
    },
    onMessage: (log, source) => {
      console.log(`[${source.server}]`)
    }
  });

  const mcpTools = await client.getTools();

  return [
    ...mcpTools,
    getCSVToJSONTool()
  ];
};
