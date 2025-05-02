import dotenv from 'dotenv';

dotenv.config();

const CONFLUENCE_HOSTNAME = process.env.CONFLUENCE_HOSTNAME;
const CONFLUENCE_TOKEN = process.env.CONFLUENCE_TOKEN;

if (!CONFLUENCE_HOSTNAME || !CONFLUENCE_TOKEN) {
    throw new Error("Missing Confluence hostname or token in environment variables");
}

const CONFLUENCE_API_URL = `https://${CONFLUENCE_HOSTNAME}/rest/api`;
const CONFLUENCE_DOWNLOAD_URL = `https://${CONFLUENCE_HOSTNAME}/download/attachments`;

const options = {
    method: 'GET',
    headers: {authorization: `Bearer ${CONFLUENCE_TOKEN}`}
  };

const apiClient = {
    get: async (url: string, params?: URLSearchParams) => {
        const response = await fetch(`${CONFLUENCE_API_URL}/${url+params}`, options);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
}

const downloadClient = {
    get: async (url: string, params?: URLSearchParams) => {
        const response = await fetch(`${CONFLUENCE_DOWNLOAD_URL}/${url+params}`, options);
        if (!response.ok) {
            throw new Error(`Error Downloading attachment: ${response.statusText}`);
        }
        return response;
    }
}

const fetchSpaces = async () => {
    try {
        return await apiClient.get('space');
    }catch (error) {
        console.error("Error fetching spaces:", error);
    }
}

const fetchSpaceDetails = async (spaceKey: string) => {
    try {
        return await apiClient.get(`space/${spaceKey}`);
    }catch (error) {
        console.error("Error fetching space details:", error);
    }
}

const fetchSpacePages = async (spaceKey: string, expand?: string, pagination?: {start: Number, limit: Number}) => {
    try {
        const params = new URLSearchParams();
        if (expand) {
            params.append('expand', expand);
        }
        if (pagination) {
            params.append('start', pagination.start.toString());
            params.append('limit', pagination.limit.toString());
        }
        return await apiClient.get(`space/${spaceKey}/content/page`, params);
    }catch (error) {
        console.error("Error fetching space pages:", error);
    }
}

const fetchPageDetails = async (pageId: string, expand: string = "space,body.storage") => {
    try {
        const params = new URLSearchParams({
            expand,
        });

        return await apiClient.get(`content/${pageId}`, params);
    }catch (error) {
        console.error("Error fetching page details:", error);
    }
}

const searchUsingCQL = async (cql: string, expand: string = "body.storage") => {
    try {
        const params = new URLSearchParams({
            cql,
            expand,
        });

        return await apiClient.get(`search`, params);
    }catch (error) {
        console.error("Error searching using CQL:", error);
    }
}

const fetchAttachments = async (pageId: string) => {
    try {
        const params = new URLSearchParams({
            expand: "metadata.properties",
        });

        return await apiClient.get(`content/${pageId}/child/attachment`, params);
    }catch (error) {
        console.error("Error fetching attachments:", error);
    }
}

const downloadAttachment = async (attachmentId: string) => {
    try {
        const params = new URLSearchParams({
            expand: "metadata.properties",
        });

        return await downloadClient.get(`content/${attachmentId}/child/attachment`, params);
    }catch (error) {
        console.error("Error downloading attachment:", error);
    }
}

export {
    fetchSpaces,
    fetchSpaceDetails,
    fetchSpacePages,
    fetchPageDetails,
    fetchPageDetails as fetchContentDetails,
    searchUsingCQL,
    fetchAttachments,
    downloadAttachment
};