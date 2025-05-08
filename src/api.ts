import env from "./env.js";
import axios from 'axios';

const CONFLUENCE_HOSTNAME = env.CONFLUENCE_HOSTNAME;
const CONFLUENCE_TOKEN = env.CONFLUENCE_TOKEN;

const CONFLUENCE_API_URL = `https://${CONFLUENCE_HOSTNAME}/rest/api`;
const CONFLUENCE_DOWNLOAD_URL = `https://${CONFLUENCE_HOSTNAME}`;

const apiClient = axios.create({
    baseURL: CONFLUENCE_API_URL,
    headers: {
        Authorization: `Bearer ${CONFLUENCE_TOKEN}`,
    },
});

export const downloadClient = axios.create({
    baseURL: CONFLUENCE_DOWNLOAD_URL,
    headers: {
        Authorization: `Bearer ${CONFLUENCE_TOKEN}`,
    },
});

const fetchSpaces = async (pagination?: { start?: Number, limit?: Number }) => {
    try {
        const { data } = await apiClient.get('space', { params: pagination });
        return data;
    } catch (error) {
        console.error("Error fetching spaces:", { error });
        throw error;
    }
}

const fetchSpaceDetails = async (spaceKey: string, expand: string = "homepage.body.view") => {
    try {
        const { data } = await apiClient.get(`space/${spaceKey}`, { params: { expand } });
        return data;
    } catch (error) {
        console.error("Error fetching space details:", error);
        throw error;
    }
}

const fetchSpacePages = async (spaceKey: string, expand?: string, pagination?: { start?: Number, limit?: Number }) => {
    try {
        const params: Record<string, string> = {};
        if (expand) {
            params.expand = expand;
        }
        if (pagination) {
            if (pagination.start !== undefined && pagination.limit !== undefined) {
                params.start = pagination.start.toString();
                params.limit = pagination.limit.toString();
            }
        }
        const { data } = await apiClient.get(`space/${spaceKey}/content/page`, { params });
        return data;
    } catch (error) {
        console.error("Error fetching space pages:", error);
    }
}

const fetchPageDetails = async (pageId: string, expand: string = "space,body.storage,children,children.page") => {
    try {
        const params = { expand }
        const { data } = await apiClient.get(`content/${pageId}`, { params });
        return data;
    } catch (error) {
        console.error("Error fetching page details:", error);
    }
}

const searchUsingCQL = async (cql: string, expand: string = "body.storage") => {
    try {
        const params = {
            cql,
            expand,
        };

        const { data } = await apiClient.get(`search`, { params });
        return data;
    } catch (error) {
        console.error("Error searching using CQL:", error);
    }
}

const fetchAttachments = async (pageId: string) => {
    try {
        const params = {
            expand: "metadata.properties",
        };

        const { data } = await apiClient.get(`content/${pageId}/child/attachment`, { params });
        return data;
    } catch (error) {
        console.error("Error fetching attachments:", error);
    }
}

const downloadAttachment = async (url: string) => {
    try {
        const { data } = await downloadClient.get(url);
        return data;
    } catch (error) {
        console.error("Error downloading attachment:", error);
    }
}

const fetchPageChildren = async (pageId: string, expand: string = "page") => {
    try {
        const params = { expand };
        const { data } = await apiClient.get(`content/${pageId}/child`, { params });
        return data;
    } catch (error) {
        console.error("Error fetching page children:", error);
        throw error;
    }
};


export {
    fetchSpaces,
    fetchSpaceDetails,
    fetchSpacePages,
    fetchPageDetails,
    fetchPageDetails as fetchContentDetails,
    searchUsingCQL,
    fetchAttachments,
    downloadAttachment,
    fetchPageChildren,
};