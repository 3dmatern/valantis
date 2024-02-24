"use server";

import axios from "axios";

const HEADERS = {
    "X-Auth": md5(process.env.X_AUTH_PASSWORD),
};
const http = axios.create({
    baseURL: process.env.API_ENDPOINT,
});

export async function getProductIDs({ offset = null, limit = null }) {
    try {
        const data = await http.post(
            {
                action: "get_ids",
                params: { offset, limit },
            },
            HEADERS
        );
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}
