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
    const [{ currentPage, pageCount }, setPaginateData] = useState({
        currentPage: 1,
        pageCount: 0,
    });
    const [productIDsCrop, setProductIDsCrop] = useState([]);
    const [productBrands, setProductBrands] = useState([]);
    const [products, setProducts] = useState([]);

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
                    const clearingDuplicates = clearingDuplicatesIDs(
                        brandsData.success
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
            const productByIDs = await fetchDataProductByIDs(productIDsCrop);

            setProducts((prev) => productByIDs);
        };

        fetchData();
    }, [productIDsCrop]);

    function changePaginateData(productIDs) {
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
    }

    async function fetchDataProductByIDs(productIDs) {
        const productsData = await getProductByIDs(productIDs);

        if (productsData?.error) {
            console.error(productsData.error);
            toast.error(productsData.error);
            return;
        }

        if (productsData?.success) {
            const clearingDuplicates = clearingDuplicatesIDs(
                productsData.success
            );
            return clearingDuplicates;
        }
    }

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

        if (isProduct && isBrand && isPrice) {
            console.log("isProduct isBrand isPrice");
            const newIDsProduct = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newIDsProduct) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const filteredProducts = productByIDs.filter(
                    (product) =>
                        values["brand"].includes(product?.brand) &&
                        product.price === +values["price"]
                );
                const filteredProductIDs = filteredProducts.map(
                    (product) => product.id
                );
                const productIDsCrop = changePaginateData(filteredProductIDs);

                setProducts((prev) =>
                    filteredProducts.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }

        if (isProduct && !isBrand && isPrice) {
            console.log("isProduct !isBrand isPrice");
            const newIDsProduct = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newIDsProduct) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const filteredProducts = productByIDs.filter(
                    (product) => product.price === +values["price"]
                );
                const filteredProductIDs = filteredProducts.map(
                    (product) => product.id
                );
                const productIDsCrop = changePaginateData(filteredProductIDs);

                setProducts((prev) =>
                    filteredProducts.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }

        if (isProduct && isBrand && !isPrice) {
            console.log("isProduct isBrand !isPrice");
            const newIDsProduct = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newIDsProduct) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const filteredProducts = productByIDs.filter((product) =>
                    values["brand"].includes(product?.brand)
                );
                const filteredProductIDs = filteredProducts.map(
                    (product) => product.id
                );
                const productIDsCrop = changePaginateData(filteredProductIDs);

                setProducts((prev) =>
                    filteredProducts.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }

        if (isProduct && !isBrand && !isPrice) {
            console.log("product");
            const newIDsProduct = await fetchDataFilteredProductIDs({
                product: values["product"],
            });

            if (newIDsProduct) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const productIDsCrop = changePaginateData(clearingDuplicates);

                setProducts((prev) =>
                    productByIDs.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }

        if (!isProduct && isBrand && !isPrice) {
            console.log("brand");
            let ids = [];

            for (let i = 0; i < values[key].length; i++) {
                const newIDs = await fetchDataFilteredProductIDs({
                    [key]: values[key][i],
                });

                if (newIDs) {
                    ids = [...ids, ...newIDs];
                }
            }

            if (ids.length > 0) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const productIDsCrop = changePaginateData(clearingDuplicates);

                setProducts((prev) =>
                    productByIDs.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }

        if (!isProduct && !isBrand && isPrice) {
            console.log("price");
            const newIDsProduct = await fetchDataFilteredProductIDs({
                product: values["price"],
            });

            if (newIDsProduct) {
                const clearingDuplicates = clearingDuplicatesIDs(newIDsProduct);
                const productByIDs = await fetchDataProductByIDs(
                    clearingDuplicates
                );
                const productIDsCrop = changePaginateData(clearingDuplicates);

                setProducts((prev) =>
                    productByIDs.filter((product) =>
                        productIDsCrop.includes(product.id)
                    )
                );
            }
            return;
        }
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
    return ids.reduce((acc, id) => {
        return acc.some((ac) => ac === id) ? acc : [...acc, id];
    }, []);
}
