"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductByIDs } from "@/actions/product";

export function useProduct(productIDsCrop) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (productIDsCrop?.length > 0) {
            console.log("render useProduct");
            const fetchData = async () => {
                const productsData = await getProductByIDs(productIDsCrop);

                if (productsData?.error) {
                    console.error(productsData.error);
                    toast.error(productsData.error);
                    return;
                }

                setProducts((prev) => {
                    const prevProucts = prev?.slice();
                    const newProducts = [
                        ...prevProucts,
                        ...productsData.success,
                    ];
                    const clearingDuplicates = newProducts.reduce(
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
        }
    }, [productIDsCrop]);

    return {
        products,
    };
}
