# Confluence MCP Server

This repository contains a MCP (Model Context Protocol) server designed for seamless integration with the Confluence collaboration platform. It provides a robust set of tools to enhance context awareness and streamline documentation workflows by leveraging the Model Context Protocol.

## Overview

The Confluence MCP Server bridges the Confluence platform with Model Context Protocol capabilities, enabling users to interact with Confluence data programmatically. This server offers a variety of tools to retrieve, manage, and manipulate Confluence content efficiently. Below is a summary of the available tools:

1. **get-confluence-spaces**: Retrieve a list of Confluence spaces, with optional pagination for managing large datasets.
2. **get-confluence-space-details**: Fetch detailed information about a specific Confluence space using its unique `spaceKey`.
3. **get-confluence-space-pages**: List all pages within a specific Confluence space, with options to expand details such as `space` or `body.storage` and support for pagination.
4. **get-confluence-page-details**: Obtain comprehensive details about a specific Confluence page, including metadata and content, with optional expansion parameters.
5. **search-confluence-using-cql**: Perform advanced searches on Confluence content using Confluence Query Language (CQL), with options to include additional details like `body.storage`.
6. **get-confluence-attachments**: Retrieve all attachments associated with a specific Confluence page, identified by its `pageId`.
7. **download-confluence-image**: Download the binary data for a specific Confluence image.
8. **download-confluence-image-and-save-it**: Download and save a Confluence image locally, returning the file path. *(Currently disabled)* 
> I'm encountering issues with GitHub Copilot Chat in VS Code, and I'm also working on another MCP server for Confluence attachments using `Python MCP SDK`.
9. **get-confluence-page-children**: Retrieve all child pages of a specific Confluence page, identified by its `pageId`.

## Recommandtion

To benefit from this MCP server, add one or more prompt files under `.github/prompts` so the LLM receives richer context before each call. For example:


Add prompt files (e.g. `space-overview.prompt.md`, `page-guidelines.prompt.md` ...) with clear, domain-specific instructions:

> \# space-overview.md
>
> You are an assistant that summarizes Confluence spaces. Given a space’s metadata and pages, provide a concise overview highlighting key sections and recent updates....


for more details [read](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)  
- [npm](https://www.npmjs.com/) (v8 or higher)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd confluencemcpserver
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```

## Configuration

Create a `.env` file in the root directory with the following environment variables:

```bash
CONFLUENCE_HOSTNAME="confluence.your-domain.com"
CONFLUENCE_AUTH_TOKEN="XXXXXXX+token+EYVzV"
```

## Build the server

```bash
npm run build
```

## Running the Server

There are two ways to run the server:

```bash
npm start
```

### Inspector Mode

To run with the MCP inspector for debugging:

```bash
npm run inspector
```

For more details, see [Model Context Protocol Inspector](https://modelcontextprotocol.io/docs/tools/inspector).

## VS Code Integration

To add this MCP server to Visual Studio Code, the first way is recommended.

### Command-line

```bash
code --add-mcp '{"name":"confmcpserver","envFile":"$CONFLUENCE_MCP_SERVER_PATH/.env","type":"stdio","command":"node","args":["$CONFLUENCE_MCP_SERVER_PATH/build/"]}'
```

> Don’t forget to change `$CONFLUENCE_MCP_SERVER_PATH`

### Via the UI

1. Press Cmd+Shift+P  
2. Type `MCP: List servers`, press Enter  
3. Click on **+ add server**  
4. Select **Command (stdio)**  
5. Enter:
   ```
   node "$CONFLUENCE_MCP_SERVER_PATH/build/index.js"
   ```

You still need Confluence server credentials. Add them to your environment, or edit your VS Code settings JSON:

```json
{
  "mcp": {
    "servers": {
      "my-confluence-mcp-server": {
        "envFile": "PATH_OF_.env",
        "type": "stdio",
        "command": "node",
        "args": [
          "...../build/"
        ]
      }
    }
  }
}
```

## Author

ennbou
