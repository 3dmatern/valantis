"use server";

import axios from "axios";
import md5 from "md5";

console.log(md5(process.env.X_AUTH_HEADER));

const HEADERS = {
    headers: {
        "X-Auth": md5(process.env.X_AUTH_HEADER),
    },
};
const http = axios.create({
    baseURL: process.env.API_ENDPOINT,
});

export async function getProductIDs(offset = 0, limit = 50) {
    try {
        const data = await http.post(
            null,
            {
                action: "get_ids",
                params: {
                    offset,
                    limit,
                },
            },
            HEADERS
        );
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getProductByIDs({ ids }) {
    try {
        const data = await http.post(null, {
            action: "get_items",
            params: {
                ids,
            },
        });
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getProductFields(params) {
    try {
        const data = await http.post(null, {
            action: "get_fields",
            params,
        });
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getFilteredProductByField(params) {
    try {
        const data = await http.post(null, {
            action: "filter",
            params,
        });
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}
