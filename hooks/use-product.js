"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getProductIDs,
    getProductByIDs,
    getProductFields,
    getFilteredProductByField,
} from "@/actions/product";
import { PAGE_SIZE } from "@/lib/constants";
import { itemsCrop } from "@/utils/paginate";

export function useProduct() {
    const [initProductIDs, setInitProductIDs] = useState([]);
    const [productIDs, setProductIDs] = useState([]);
    const [{ currentPage, pageCount }, setPaginateData] = useState({
        currentPage: 1,
        pageCount: 0,
    });
    const [productBrands, setProductBrands] = useState([]);
    const [products, setProducts] = useState([]);

    const changePaginateData = useCallback(function (items) {
        const pageCount = Math.ceil(items.length / PAGE_SIZE);
        let productIDsCrop = [];

        setPaginateData((prev) => {
            productIDsCrop = itemsCrop(items, prev.currentPage, PAGE_SIZE);

            return {
                ...prev,
                itemsCount: items.length,
                pageCount,
            };
        });

        return productIDsCrop;
    }, []);

    const fetchDataProductByIDs = useCallback(async (newProductIDs) => {
        const productsData = await getProductByIDs(newProductIDs);

        if (productsData?.error) {
            console.error(productsData.error);
            return fetchDataProductByIDs(newProductIDs);
        }

        if (productsData?.success) {
            const productNotDuplicate = clearingDuplicatesProduct(
                productsData.success
            );
            const productsCrop = productNotDuplicate.filter((product) =>
                newProductIDs.includes(product.id)
            );
            return productsCrop;
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const allProductIDsData = await fetchDataProductIDs({ offset: 0 });

            if (allProductIDsData?.length) {
                const clearingDuplicates =
                    clearingDuplicatesIDs(allProductIDsData);
                const productIDsCrop = changePaginateData(clearingDuplicates);

                const products = await fetchDataProductByIDs(productIDsCrop);

                if (products) {
                    setProducts((prev) => products);
                    setInitProductIDs((prev) => clearingDuplicates);
                    setProductIDs((prev) => clearingDuplicates);
                }
            }
        };

        fetchData();
    }, [changePaginateData, fetchDataProductByIDs]);

    useEffect(() => {
        const fetchData = async () => {
            const brandsData = await getProductFields({ field: "brand" });

            if (brandsData?.error) {
                return;
            }

            if (brandsData?.success) {
                setProductBrands((prev) => {
                    const brandsNotNull = brandsData?.success.filter(
                        (brand) => brand !== null
                    );
                    const clearingDuplicates =
                        clearingDuplicatesIDs(brandsNotNull);

                    return clearingDuplicates.map(
                        (b) => b && { id: b, label: b }
                    );
                });
            }
        };

        fetchData();
    }, []);

    async function handleChangePage(selectPage) {
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));

        const newProductCrop = itemsCrop(productIDs, selectPage, PAGE_SIZE);
        const products = await fetchDataProductByIDs(newProductCrop);

        if (products) {
            setProducts((prev) => products);
        }
    }

    async function handleClickPrevPage() {
        if (currentPage === 1 || pageCount === 0) {
            return;
        }

        const selectPage = currentPage - 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));

        const newProductCrop = itemsCrop(productIDs, selectPage, PAGE_SIZE);
        const products = await fetchDataProductByIDs(newProductCrop);

        if (products) {
            setProducts((prev) => products);
        }
    }

    async function handleClickNextPage() {
        if (currentPage === pageCount || pageCount === 0) {
            return;
        }

        const selectPage = currentPage + 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));

        const newProductCrop = itemsCrop(productIDs, selectPage, PAGE_SIZE);
        const products = await fetchDataProductByIDs(newProductCrop);

        if (products) {
            setProducts((prev) => products);
        }
    }

    async function handleClickApplyFilter(values) {
        const isProduct = values["product"] && values["product"] !== "";
        const isBrand = values["brand"] && values["brand"].length;
        const isPrice = values["price"] && +values["price"];
        let newProductByIDs = [];
        let newProductIDsCrop = [];

        if (isProduct && isBrand && isPrice) {
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newProductIDs) {
                const newProducts = await fetchDataProductByIDs(newProductIDs);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);

                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) =>
                        product.brand &&
                        values["brand"].some((b) => b === product.brand) &&
                        product.price === +values["price"]
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
                setProductIDs(filteredNewProductIDs);
            }
        }

        if (isProduct && !isBrand && isPrice) {
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newProductIDs) {
                const newProducts = await fetchDataProductByIDs(newProductIDs);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);
                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) => product.price === +values["price"]
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
                setProductIDs(filteredNewProductIDs);
            }
        }

        if (isProduct && isBrand && !isPrice) {
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newProductIDs) {
                const newProducts = await fetchDataProductByIDs(newProductIDs);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);
                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) =>
                        product.brand &&
                        values["brand"].some((b) => b === product.brand)
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
                setProductIDs(filteredNewProductIDs);
            }
        }

        if (!isProduct && isBrand && isPrice) {
            const newProductIDsBrand = await fetchDataBrandIDs(values["brand"]);
            const newProductIDsPrice = await fetchDataFilteredProductIDs({
                price: +values["price"],
            });

            if (newProductIDsBrand && newProductIDsPrice) {
                const newProducts = await fetchDataProductByIDs([
                    ...newProductIDsBrand,
                    ...newProductIDsPrice,
                ]);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);
                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) =>
                        product.brand &&
                        values["brand"].some((b) => b === product.brand) &&
                        product.price === +values["price"]
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
                setProductIDs(filteredNewProductIDs);
            }
        }

        if (isProduct && !isBrand && !isPrice) {
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newProductIDs) {
                const newProductIDsNotDuplicate =
                    clearingDuplicatesIDs(newProductIDs);
                newProductByIDs = await fetchDataProductByIDs(
                    newProductIDsNotDuplicate
                );
                newProductIDsCrop = changePaginateData(
                    newProductIDsNotDuplicate
                );

                setProductIDs(newProductIDsNotDuplicate);
            }
        }

        if (!isProduct && isBrand && !isPrice) {
            const newProductIDs = await fetchDataBrandIDs(values["brand"]);

            if (newProductIDs.length > 0) {
                const newProductIDsNotDuplicate =
                    clearingDuplicatesIDs(newProductIDs);
                newProductByIDs = await fetchDataProductByIDs(
                    newProductIDsNotDuplicate
                );
                newProductIDsCrop = changePaginateData(
                    newProductIDsNotDuplicate
                );

                setProductIDs(newProductIDsNotDuplicate);
            }
        }

        if (!isProduct && !isBrand && isPrice) {
            const newProductIDs = await fetchDataFilteredProductIDs({
                price: +values["price"],
            });

            if (newProductIDs) {
                const newProductIDsNotDuplicate =
                    clearingDuplicatesIDs(newProductIDs);
                newProductByIDs = await fetchDataProductByIDs(
                    newProductIDsNotDuplicate
                );
                newProductIDsCrop = changePaginateData(
                    newProductIDsNotDuplicate
                );

                setProductIDs(newProductIDsNotDuplicate);
            }
        }

        setProducts((prev) =>
            newProductByIDs?.filter((product) =>
                newProductIDsCrop.includes(product.id)
            )
        );
    }

    async function handleClickResetFilter() {
        const productIDsCrop = changePaginateData(initProductIDs);
        const products = await fetchDataProductByIDs(productIDsCrop);

        if (products) {
            setProducts((prev) => products);
            setProductIDs(initProductIDs);
        }
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
        return;
    } else if (data?.success) {
        return data.success;
    }
}

function clearingDuplicatesIDs(ids) {
    return ids?.reduce(
        (acc, id) => (acc.some((ac) => ac === id) ? acc : [...acc, id]),
        []
    );
}

function clearingDuplicatesProduct(items) {
    return items?.reduce(
        (acc, product) =>
            acc.some((ac) => ac.id === product.id) ? acc : [...acc, product],
        []
    );
}

async function fetchDataBrandIDs(brandIDs) {
    let ids = [];

    for (let i = 0; i < brandIDs.length; i++) {
        const newIDs = await fetchDataFilteredProductIDs({
            brand: brandIDs[i],
        });

        if (newIDs) {
            ids = [...ids, ...newIDs];
        }
    }

    return ids;
}
