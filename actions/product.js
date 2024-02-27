"use client";

import axios from "axios";
import md5 from "md5";

import config from "@/config.json";
import { getConcatYMD } from "@/utils/formatedDate";

const xAuthValue = md5(config.X_AUTH + getConcatYMD());

const HEADERS = {
    headers: {
        "X-Auth": xAuthValue,
    },
};
const http = axios.create({
    baseURL: config.API_ENDPOINT,
});

export async function getProductIDs(params = null) {
    try {
        const { data } = await http.post(
            "/",
            {
                action: "get_ids",
                params,
            },
            HEADERS
        );

        return { success: data.result };
    } catch (error) {
        console.error("getProductIDs", error?.response.data);
        return;
    }
}

export async function getProductByIDs(ids) {
    try {
        const { data } = await http.post(
            "/",
            {
                action: "get_items",
                params: {
                    ids,
                },
            },
            HEADERS
        );

        return { success: data.result };
    } catch (error) {
        console.error("getProductByIDs", error?.response.data);
        return;
    }
}

export async function getProductFields(params) {
    try {
        const { data } = await http.post(
            "/",
            {
                action: "get_fields",
                params,
            },
            HEADERS
        );

        return { success: data.result };
    } catch (error) {
        console.error("getProductFields", error?.response?.data);
        return;
    }
}

export async function getFilteredProductByField(params) {
    try {
        const { data } = await http.post(
            "/",
            {
                action: "filter",
                params,
            },
            HEADERS
        );

        return { success: data.result };
    } catch (error) {
        console.error("getFilteredProductByField", error?.response.data);
        return;
    }
}
