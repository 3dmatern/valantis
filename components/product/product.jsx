"use client";

import React, { memo } from "react";

import { ProductWrapper } from "@/components/product/ui/product-wrapper";
import { ProductCard } from "./ui/product-card";
import { ProductPagination } from "./product-pagination";

export const Product = memo(function Product({
    currentPage,
    pageCount,
    onChangePage,
    onClickPrevPage,
    onClickNextPage,
    products,
}) {
    return (
        <>
            <ProductWrapper>
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
                        productId={product.id}
                        brand={product.brand}
                        name={product.product}
                        price={product.price}
                    />
                ))}
            </ProductWrapper>

            <ProductPagination
                currentPage={currentPage}
                pageCount={pageCount}
                onChangePage={onChangePage}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
        </>
    );
});
