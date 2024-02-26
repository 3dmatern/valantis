"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductIDs } from "@/actions/product";

export function useProductIDs() {
    const [productIDs, setProductIDs] = useState([]);

    useEffect(() => {
        const fetchDataAndSet = async () => {
            const allProductIDsData = await fetchData({ offset: 0 });

            if (allProductIDsData?.length) {
                setProductIDs((prev) => {
                    const clearingDuplicates = allProductIDsData.reduce(
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
    let updatedProductIDs = [...dataSoFar];

    if (productIDsData?.error) {
        console.error(productIDsData.error);
        toast.error(productIDsData.error);
        return;
    }

    if (productIDsData?.success) {
        updatedProductIDs = [...updatedProductIDs, ...productIDsData.success];
        const productIDsLength = productIDsData.success.length;

        if (productIDsLength === 100) {
            return fetchData(
                { offset: offset + productIDsLength },
                updatedProductIDs
            );
        }
    }

    return updatedProductIDs;
};
