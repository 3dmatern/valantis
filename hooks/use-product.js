"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductByIDs } from "@/actions/product";

export function useProduct(productIDsCrop) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log("render useProduct");
        const fetchData = async () => {
            const productsData = await getProductByIDs(productIDsCrop);

            if (productsData?.error) {
                console.error(productsData.error);
                toast.error(productsData.error);
                return;
            }

            setProducts((prev) => {
                const clearingDuplicates = productsData.success.reduce(
                    (acc, product) => {
                        return acc.some((ac) => ac.id === product.id)
                            ? acc
                            : [...acc, product];
                    },
                    []
                );
                return clearingDuplicates;
            });
        };

        fetchData();
    }, [productIDsCrop]);

    return {
        products,
    };
}
