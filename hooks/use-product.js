"use client";

import { useEffect, useState } from "react";

import { getProductIDs } from "@/actions/product";

export function useProduct() {
    const [productIDs, setProductIDs] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProductIDs();
            console.log(data);
            // setProductIDs(data.data);
        };

        fetchData();
    }, []);

    return {
        productIDs,
    };
}
