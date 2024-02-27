"use client";

import { useCallback, useEffect, useState } from "react";
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
    const [{ currentPage, pageCount }, setPaginateData] = useState({
        currentPage: 1,
        pageCount: 0,
    });
    const [productIDsCrop, setProductIDsCrop] = useState([]);
    const [productBrands, setProductBrands] = useState([]);
    const [products, setProducts] = useState([]);

    const changePaginateData = useCallback(function (productIDs) {
        const pageCount = Math.ceil(productIDs.length / PAGE_SIZE);
        let productIDsCrop = [];

        setPaginateData((prev) => {
            productIDsCrop = itemsCrop(productIDs, prev.currentPage, PAGE_SIZE);

            return {
                ...prev,
                itemsCount: productIDs.length,
                pageCount,
            };
        });

        return productIDsCrop;
    }, []);

    const fetchDataProductByIDs = useCallback(async (productIDs) => {
        const productsData = await getProductByIDs(productIDs);

        if (productsData?.error) {
            console.error(productsData.error);
            toast.error(productsData.error);
            return;
        }

        if (productsData?.success) {
            const productNotDuplicate = clearingDuplicatesProduct(
                productsData.success
            );
            const productsCrop = productNotDuplicate.filter((product) =>
                productIDs.includes(product.id)
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

                setProductIDs((prev) => clearingDuplicates);
                setProductIDsCrop((prev) => productIDsCrop);
            }
        };

        fetchData();
    }, [changePaginateData]);

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

    useEffect(() => {
        const fetchData = async () => {
            const productByIDs = await fetchDataProductByIDs(productIDsCrop);

            if (productByIDs) {
                setProducts((prev) => productByIDs);
            }
        };

        fetchData();
    }, [fetchDataProductByIDs, productIDsCrop]);

    function handleChangePage(selectPage) {
        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
        setProductIDsCrop((prev) =>
            itemsCrop(productIDs, selectPage, PAGE_SIZE)
        );
    }

    function handleClickPrevPage() {
        if (currentPage === 1 || pageCount === 0) {
            return;
        }

        const selectPage = currentPage - 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
        setProductIDsCrop((prev) =>
            itemsCrop(productIDs, selectPage, PAGE_SIZE)
        );
    }

    function handleClickNextPage() {
        if (currentPage === pageCount || pageCount === 0) {
            return;
        }

        const selectPage = currentPage + 1;

        setPaginateData((prev) => ({
            ...prev,
            currentPage: selectPage,
        }));
        setProductIDsCrop((prev) =>
            itemsCrop(productIDs, selectPage, PAGE_SIZE)
        );
    }

    async function handleClickApplyFilter(values) {
        const isProduct = values["product"] && values["product"] !== "";
        const isBrand = values["brand"] && values["brand"].length;
        const isPrice = values["price"] && +values["price"];
        let newProductByIDs = [];
        let newProductIDsCrop = [];

        if (isProduct && isBrand && isPrice) {
            console.log("isProduct isBrand isPrice");
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });
            console.log(newProductIDs);

            if (newProductIDs) {
                const newProducts = await fetchDataProductByIDs(newProductIDs);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);
                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) =>
                        product.brand &&
                        values["brand"].includes(product.brand) &&
                        product.price === +values["price"]
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
            }
        }

        if (isProduct && !isBrand && isPrice) {
            console.log("isProduct !isBrand isPrice");
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
            }
        }

        if (isProduct && isBrand && !isPrice) {
            console.log("isProduct isBrand !isPrice");
            const newProductIDs = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newProductIDs) {
                const newProducts = await fetchDataProductByIDs(newProductIDs);
                const newProductsNotDuplicate =
                    clearingDuplicatesProduct(newProducts);
                newProductByIDs = newProductsNotDuplicate.filter(
                    (product) =>
                        product.brand && values["brand"].includes(product.brand)
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
            }
        }

        if (!isProduct && isBrand && isPrice) {
            console.log("!isProduct isBrand isPrice");
            const newProductIDsBrand = await fetchDataFilteredProductIDs({
                brand: values["brand"],
            });
            const newProductIDsPrice = await fetchDataFilteredProductIDs({
                price: values["price"],
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
                        values["brand"].includes(product.brand) &&
                        product.price === +values["price"]
                );
                const filteredNewProductIDs = newProductByIDs.map(
                    (product) => product.id
                );
                newProductIDsCrop = changePaginateData(filteredNewProductIDs);
            }
        }

        if (isProduct && !isBrand && !isPrice) {
            console.log("product");
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
            }
        }

        if (!isProduct && isBrand && !isPrice) {
            console.log("brand");
            let ids = [];

            for (let i = 0; i < values["brand"].length; i++) {
                const newIDs = await fetchDataFilteredProductIDs({
                    brand: values["brand"][i],
                });

                if (newIDs) {
                    ids = [...ids, ...newIDs];
                }
            }

            if (ids.length > 0) {
                const newProductIDsNotDuplicate = clearingDuplicatesIDs(ids);
                newProductByIDs = await fetchDataProductByIDs(
                    newProductIDsNotDuplicate
                );
                newProductIDsCrop = changePaginateData(
                    newProductIDsNotDuplicate
                );
            }
        }

        if (!isProduct && !isBrand && isPrice) {
            console.log("price");
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
            }
        }

        setProducts((prev) =>
            newProductByIDs?.filter((product) =>
                newProductIDsCrop.includes(product.id)
            )
        );
    }

    async function handleClickResetFilter() {
        const productIDsCrop = changePaginateData(productIDs);

        setProductIDsCrop((prev) => productIDsCrop);
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
