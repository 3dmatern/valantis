"use server";

import axios from "axios";
import md5 from "md5";

const HEADERS = {
    headers: {
        "X-Auth": md5(process.env.X_AUTH_HEADER),
    },
};
const http = axios.create({
    baseURL: process.env.API_ENDPOINT,
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
