import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchSpaces, fetchSpaceDetails, fetchSpacePages, fetchPageDetails, searchUsingCQL, fetchAttachments, downloadAttachment, fetchPageChildren, downloadClient } from "./api.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { saveAttachment, extractFileNameFromUrl } from "./utils.js";

const server = new McpServer({
  name: "confluencemcpserver",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

const loadData = async (fetchFunction: Promise<any>, formatFetchedData?: (data: any) => string): Promise<CallToolResult> => {
  try {
    const data = await fetchFunction;
    return {
      content: [{
        type: "text",
        text: formatFetchedData ? formatFetchedData(data) : data,
      }],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      content: [{
        type: "text",
        text: "Error fetching data",
      }],
    };
  }
}

const stringifyData = (data: any) => JSON.stringify(data, null, 2)

const encodeImage = (data: any): CallToolResult => {
  return {
    content: [{
      type: "image",
      data: Buffer.from(data, 'binary').toString('base64'),
      mimeType: "image/png"
    }],
  };
}

const getConfluenceSpacesTool = server.tool(
  "get-confluence-spaces",
  "Retrieve a list of Confluence spaces. You can use the pagination parameter to control the number of results returned.",
  { pagination: z.object({ start: z.number().optional(), limit: z.number().optional() }).optional() },
  async ({ pagination }) => {
    return await loadData(fetchSpaces(pagination), stringifyData);
  }
);

const getConfluenceSpaceDetailsTool = server.tool(
  "get-confluence-space-details",
  "Retrieve detailed information about a specific Confluence space. The spaceKey can be obtained from the get-confluence-spaces tool.",
  { spaceKey: z.string() },
  async ({ spaceKey }) => {
    return await loadData(fetchSpaceDetails(spaceKey), stringifyData);
  }
);

const getConfluenceSpacePagesTool = server.tool(
  "get-confluence-space-pages",
  "Retrieve a list of pages within a specific Confluence space. You can expand the response with additional details such as space or body.storage. Supports pagination.",
  {
    spaceKey: z.string(),
    expand: z.string().optional(),
    pagination: z.object({ start: z.number().optional(), limit: z.number().optional() }).optional(),
  },
  async ({ spaceKey, expand, pagination }) => {
    console.error("test", spaceKey, expand, pagination);
    return await loadData(fetchSpacePages(spaceKey, expand, pagination), stringifyData);
  }
);

const getConfluencePageDetailsTool = server.tool(
  "get-confluence-page-details",
  "Retrieve detailed information about a specific Confluence page. The pageId can be obtained from the get-confluence-space-pages tool. Optionally, use the expand parameter to include additional details such as body.storage .",
  { pageId: z.string(), expand: z.string().optional() },
  async ({ pageId, expand = "space,body.storage,children,children.page,children.page.body.storage" }) => {
    return await loadData(fetchPageDetails(pageId, expand), stringifyData);
  }
);

const searchConfluenceUsingCQLTool = server.tool(
  "search-confluence-using-cql",
  "Retrieve Confluence content using CQL (Confluence Query Language). You can use the expand parameter to include additional details such as body.storage.",
  { cql: z.string(), expand: z.string().optional() },
  async ({ cql, expand = "body.storage" }) => {
    return await loadData(searchUsingCQL(cql, expand), stringifyData);
  }
);

const getConfluenceAttachmentsTool = server.tool(
  "get-confluence-attachments",
  "Retrieve all attachments associated with a specific Confluence page. The pageId parameter can be obtained using the get-confluence-space-pages tool.",
  { pageId: z.string() },
  async ({ pageId }) => {
    return await loadData(fetchAttachments(pageId), stringifyData);
  }
);

const downloadConfluenceImageTool = server.tool(
  "download-confluence-image",
  "Download the binary for a specific Confluence image.",
  { downloadUrl: z.string() },
  async ({ downloadUrl }) => {
    const data = await downloadAttachment(downloadUrl);
    return encodeImage(data);
  }
);

const downloadConfluenceImageAndSaveItTool = server.tool(
  "download-confluence-image-and-save-it",
  "Download the Confluence image, save it locally, and return the saved file path.",
  {
    downloadUrl: z.string(),
    fileName: z.string().optional(),
  },
  async ({ downloadUrl, fileName }) => {
    const data = await downloadAttachment(downloadUrl);
    const name = fileName ?? extractFileNameFromUrl(downloadUrl);
    const savedPath = await saveAttachment(data, name);
    return {
      content: [{
        type: "text",
        text: savedPath,
      }],
    };
  }
)

downloadConfluenceImageAndSaveItTool.disable();

const getConfluencePageChildrenTool = server.tool(
  "get-confluence-page-children",
  "Retrieve all children of a specific Confluence page. The pageId parameter can be obtained using the get-confluence-space-pages tool.",
  { pageId: z.string() },
  async ({ pageId }) => {
    return await loadData(fetchPageChildren(pageId), stringifyData);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Confluence MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});