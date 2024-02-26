"use client";

import React, { memo } from "react";

import { ProductWrapper } from "@/components/product/ui/product-wrapper";
import { ProductCard } from "./ui/product-card";
import { ProductPagination } from "./product-pagination";
import { cn } from "@/lib/utils";

export const Product = memo(function Product({
    className,
    currentPage,
    pageCount,
    products,
    onChangePage,
    onClickPrevPage,
    onClickNextPage,
}) {
    return (
        <ProductLayout className={className}>
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
        </ProductLayout>
    );
});

function ProductLayout({ className, children }) {
    return <div className={cn("", className)}>{children}</div>;
}
