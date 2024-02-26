"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductByIDs, getProductFields } from "@/actions/product";

export function useProduct(productIDsCrop) {
    const [products, setProducts] = useState([]);
    const [productBrands, setProductBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const brandsData = await getProductFields({ field: "brand" });

            if (brandsData?.error) {
                console.error(brandsData.error);
                toast.error(brandsData.error);
                return;
            }

            if (brandsData?.success) {
                setProductBrands((prev) => {
                    const clearingDuplicates = brandsData.success.reduce(
                        (acc, brand) => {
                            return acc.includes(brand) ? acc : [...acc, brand];
                        },
                        []
                    );

                    return clearingDuplicates
                        .filter((brand) => brand)
                        .map((b) => b && { id: b, label: b });
                });
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const productsData = await getProductByIDs(productIDsCrop);

            if (productsData?.error) {
                console.error(productsData.error);
                toast.error(productsData.error);
                return;
            }

            if (productsData.success) {
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
            }
        };

        fetchData();
    }, [productIDsCrop]);

    return {
        products,
        productBrands,
    };
}
