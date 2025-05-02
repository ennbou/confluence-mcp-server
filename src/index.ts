import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchSpaces, fetchSpaceDetails, fetchSpacePages, fetchPageDetails, searchUsingCQL, fetchAttachments, downloadAttachment } from "./api.js";

const server = new McpServer({
  name: "confluencemcpserver",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

const getConfluenceSpacesTool = server.tool("get-confluence-spaces", "fetch confluence spaces", {}, async () => {
  try {
    const spaces = await fetchSpaces();
    return {
      content: [{
        type: "text",
        text: JSON.stringify(spaces, null, 2),
      }],
    };
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return {
      content: [{
        type: "text",
        text: "Error fetching spaces",
      }],
    };
  }
});

const getConfluenceSpaceDetailsTool = server.tool("get-confluence-space-details", "fetch confluence space details", { spaceKey: z.string() }, async ({ spaceKey }) => {
  try {
    const spaceDetails = await fetchSpaceDetails(spaceKey);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(spaceDetails, null, 2),
      }],
    };
  } catch (error) {
    console.error(`Error fetching space details for ${spaceKey}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error fetching space details",
      }],
    };
  }
});

const getConfluenceSpacePagesTool = server.tool("get-confluence-space-pages", "fetch confluence space pages", { spaceKey: z.string(), expand: z.string().optional(), pagination: z.object({ start: z.number(), limit: z.number() }).optional() }, async ({ spaceKey, expand, pagination }) => {
  try {
    const pages = await fetchSpacePages(spaceKey, expand, pagination);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(pages, null, 2),
      }],
    };
  } catch (error) {
    console.error(`Error fetching pages for space ${spaceKey}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error fetching space pages",
      }],
    };
  }
});

const getConfluencePageDetailsTool = server.tool("get-confluence-page-details", "fetch confluence page details", { pageId: z.string(), expand: z.string().optional() }, async ({ pageId, expand = "space,body.storage" }) => {
  try {
    const pageDetails = await fetchPageDetails(pageId, expand);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(pageDetails, null, 2),
      }],
    };
  } catch (error) {
    console.error(`Error fetching page details for ${pageId}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error fetching page details",
      }],
    };
  }
});

const searchConfluenceUsingCQLTool = server.tool("search-confluence-using-cql", "search confluence using CQL", { cql: z.string(), expand: z.string().optional() }, async ({ cql, expand = "body.storage" }) => {
  try {
    const results = await searchUsingCQL(cql, expand);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(results, null, 2),
      }],
    };
  } catch (error) {
    console.error(`Error searching using CQL ${cql}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error searching using CQL",
      }],
    };
  }
});

const getConfluenceAttachmentsTool = server.tool("get-confluence-attachments", "fetch confluence attachments", { pageId: z.string() }, async ({ pageId }) => {
  try {
    const attachments = await fetchAttachments(pageId);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(attachments, null, 2),
      }],
    };
  } catch (error) {
    console.error(`Error fetching attachments for page ${pageId}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error fetching attachments",
      }],
    };
  }
});

const downloadConfluenceAttachmentTool = server.tool("download-confluence-attachment", "download confluence attachment", { attachmentId: z.string() }, async ({ attachmentId }) => {
  try {
    const response = await downloadAttachment(attachmentId);
    return {
      content: [{
        type: "text",
        text: "Attachment downloaded successfully",
      }],
    };
  } catch (error) {
    console.error(`Error downloading attachment ${attachmentId}:`, error);
    return {
      content: [{
        type: "text",
        text: "Error downloading attachment",
      }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Confluence MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});