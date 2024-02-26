"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    getProductIDs,
    getProductByIDs,
    getProductFields,
    getFilteredProductByField,
} from "@/actions/product";
import { PAGE_SIZE } from "@/lib/constants";
import { itemsCrop } from "@/utils/paginate";

export function useProduct() {
    const [productIDs, setProductIDs] = useState([]);
    const [{ currentPage, pageCount, productIDsCrop }, setPaginateData] =
        useState({
            currentPage: 1,
            pageCount: 0,
            productIDsCrop: [],
        });
    const [productBrands, setProductBrands] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const allProductIDsData = await fetchDataProductIDs({ offset: 0 });

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

                    changePaginateData(clearingDuplicates);
                    return clearingDuplicates;
                });
            }
        };

        fetchData();
    }, []);

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
            await fetchDataProductByIDs(productIDsCrop);
        };

        fetchData();
    }, [productIDsCrop]);

    function changePaginateData(productIDs) {
        const pageCount = Math.ceil(productIDs.length / PAGE_SIZE);

        setPaginateData((prev) => ({
            ...prev,
            itemsCount: productIDs.length,
            pageCount,
            productIDsCrop: itemsCrop(productIDs, prev.currentPage, PAGE_SIZE),
        }));
    }

    async function fetchDataProductByIDs(productIDs) {
        const productsData = await getProductByIDs(productIDs);

        if (productsData?.error) {
            console.error(productsData.error);
            toast.error(productsData.error);
            return;
        }

        if (productsData?.success) {
            setProducts((prev) => {
                const clearingDuplicates = productsData?.success.reduce(
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
    }

    function handleChangePage(selectPage) {
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            productIDsCrop: itemsCrop(productIDs, selectPage, PAGE_SIZE),
        }));
    }

    function handleClickPrevPage() {
        if (currentPage === 1 || pageCount === 0) {
            return;
        }

        const selectPage = currentPage - 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            productIDsCrop: itemsCrop(productIDs, selectPage, PAGE_SIZE),
        }));
    }

    function handleClickNextPage() {
        if (currentPage === pageCount || pageCount === 0) {
            return;
        }

        const selectPage = currentPage + 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
            productIDsCrop: itemsCrop(productIDs, selectPage, PAGE_SIZE),
        }));
    }

    async function handleClickApplyFilter(values) {
        let ids = [];

        for (const key in values) {
            if (Array.isArray(values[key]) && values[key].length) {
                for (let i = 0; i < values[key].length; i++) {
                    const newIDs = await fetchDataFilteredProductIDs({
                        [key]: values[key][i],
                    });

                    if (newIDs) {
                        ids = [...ids, ...newIDs];
                    }
                }
            } else if (key === "price" && +values[key]) {
                const newIDs = await fetchDataFilteredProductIDs({
                    [key]: +values[key],
                });

                if (newIDs) {
                    ids = [...ids, ...newIDs];
                }
            } else {
                const newIDs = await fetchDataFilteredProductIDs({
                    [key]: values[key],
                });

                if (newIDs) {
                    ids = [...ids, ...newIDs];
                }
            }
        }

        changePaginateData(ids);
    }

    async function handleClickResetFilter() {
        changePaginateData(productIDs);
    }

    return {
        currentPage,
        pageCount,
        productBrands,
        products,
        onChangePage: handleChangePage,
        onClickPrevPage: handleClickPrevPage,
        onClickNextPage: handleClickNextPage,
        onClickApplyFilter: handleClickApplyFilter,
        onClickResetFilter: handleClickResetFilter,
    };
}

async function fetchDataProductIDs({ offset, limit }, dataSoFar = []) {
    const data = await getProductIDs({ offset, limit });
    let updatedProductIDs = [...dataSoFar];

    if (data?.error) {
        console.error(data.error);
        toast.error(data.error);
        return;
    }

    if (data?.success) {
        updatedProductIDs = [...updatedProductIDs, ...data.success];
        const productIDsLength = data.success.length;

        if (productIDsLength === 100) {
            return fetchDataProductIDs(
                { offset: offset + productIDsLength },
                updatedProductIDs
            );
        }
    }

    return updatedProductIDs;
}

async function fetchDataFilteredProductIDs(params) {
    const data = await getFilteredProductByField(params);

    if (data?.error) {
        console.error(data.error);
        toast.error(data.error);
        return;
    } else if (data?.success) {
        return data.success;
    }
}
