"use client";

import axios from "axios";
import md5 from "md5";

const HEADERS = {
    headers: {
        "X-Auth": md5("Valantis_20240225"),
    },
};
const http = axios.create({
    baseURL: "https://api.valantis.store:41000",
});

export async function getProductIDs(offset = 0, limit = 50) {
    try {
        const { data } = await http.post(
            "/",
            {
                action: "get_ids",
                params: {
                    offset,
                    limit,
                },
            },
            HEADERS
        );

        return { success: data.result };
    } catch (error) {
        console.error("getProductIDs", error?.response);
        return { error: error?.response?.data };
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
        console.error("getProductByIDs", error?.response);
        return { error: error?.response?.data };
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
        console.log(data);
        return data;
    } catch (error) {
        console.error("getProductFields", error?.response);
        return { error: error?.response?.data };
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
        console.log(data);
        return data;
    } catch (error) {
        console.error("getFilteredProductByField", error?.response);
        return { error: error?.response?.data };
    }
}
