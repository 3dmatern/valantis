"use client";

import React, { memo } from "react";

import { cn } from "@/lib/utils";

import { ProductWrapper } from "@/components/product/ui/product-wrapper";
import { ProductCard } from "./ui/product-card";
import { ProductPagination } from "./product-pagination";

export const Product = memo(function Product({
    className,
    currentPage,
    pageCount,
    products,
    onChangePage,
    onClickPrevPage,
    onClickNextPage,
}) {
    function getContent() {
        if (products && products.length > 0) {
            return products.map((product) => (
                <ProductCard
                    key={product.id}
                    productId={product.id}
                    brand={product.brand}
                    name={product.product}
                    price={product.price}
                />
            ));
        }

        return (
            <p className="col-span-4 text-center md:text-base text-sm">
                Товаров не найдено...
            </p>
        );
    }

    return (
        <ProductLayout className={className}>
            <ProductWrapper>{getContent()}</ProductWrapper>

            {products?.length > 0 && (
                <ProductPagination
                    className="lg:static absolute bottom-0 right-16"
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onChangePage={onChangePage}
                    onClickPrevPage={onClickPrevPage}
                    onClickNextPage={onClickNextPage}
                />
            )}
        </ProductLayout>
    );
});

function ProductLayout({ className, children }) {
    return (
        <div
            className={cn(
                "sm:pb-0 pb-14 lg:col-span-4 md:col-span-3 sm:col-span-2 col-span-1 relative",
                className
            )}
        >
            {children}
        </div>
    );
}
