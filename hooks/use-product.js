"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductByIDs, getProductIDs } from "@/actions/product";

export function useProduct() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const productIDsData = await getProductIDs();

            if (productIDsData.error) {
                console.error(productIDsData.error);
                toast.error(productIDsData.error);
                return;
            }

            const productsData = await getProductByIDs(productIDsData.success);

            if (productsData.error) {
                console.error(productIDsData.error);
                toast.error(productsData.error);
                return;
            }

            setProducts((prev) => {
                const prevProucts = prev?.slice();
                const newProducts = [...prevProucts, ...productsData.success];
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
    }, []);

    return {
        products,
    };
}
