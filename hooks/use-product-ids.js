"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductIDs } from "@/actions/product";

export function useProductIDs() {
    const [productIDs, setProductIDs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const productIDsData = await getProductIDs();

            if (productIDsData?.error) {
                console.error(productIDsData.error);
                toast.error(productIDsData.error);
                return;
            }

            setProductIDs((prev) => {
                const prevProuctIDs = prev?.slice();
                const newProductIDs = [
                    ...prevProuctIDs,
                    ...productIDsData.success,
                ];
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
        };

        fetchData();
    }, []);

    return {
        productIDs,
    };
}
