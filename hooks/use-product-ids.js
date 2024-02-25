"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductIDs } from "@/actions/product";

export function useProductIDs() {
    const [productIDs, setProductIDs] = useState([]);

    useEffect(() => {
        const fetchDataAndSet = async () => {
            const allData = await fetchData({ offset: 0 });

            if (allData?.length) {
                setProductIDs((prev) => {
                    const prevProuctIDs = prev?.slice();
                    const newProductIDs = [...prevProuctIDs, ...allData];
                    const clearingDuplicates = newProductIDs.reduce(
                        (acc, productId) => {
                            return acc.some((ac) => ac === productId)
                                ? acc
                                : [...acc, productId];
                        },
                        []
                    );
                    return clearingDuplicates;
                });
            }
        };

        fetchDataAndSet();
    }, []);

    return {
        productIDs,
    };
}

const fetchData = async ({ offset, limit }, dataSoFar = []) => {
    const productIDsData = await getProductIDs({ offset, limit });

    if (productIDsData?.error) {
        console.error(productIDsData.error);
        toast.error(productIDsData.error);
        return;
    }

    const updatedData = [...dataSoFar, ...productIDsData.success];
    const productIDsLength = productIDsData.success.length;

    if (productIDsLength === 100) {
        return fetchData({ offset: offset + productIDsLength }, updatedData);
    }

    return updatedData;
};
