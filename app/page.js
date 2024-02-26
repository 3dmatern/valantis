"use client";

import { useProduct } from "@/hooks/use-product";

import { Product } from "@/components/product";
import { ProductFilterForm } from "@/components/product/product-filter-form";

export default function Home() {
    const {
        currentPage,
        pageCount,
        productBrands,
        products,
        onChangePage,
        onClickPrevPage,
        onClickNextPage,
        onClickApplyFilter,
        onClickResetFilter,
    } = useProduct();

    return (
        <HomePageLayout>
            <ProductFilterForm
                brands={productBrands}
                onClickApplyFilter={onClickApplyFilter}
                onClickResetFilter={onClickResetFilter}
            />
            <Product
                className="col-span-4"
                currentPage={currentPage}
                pageCount={pageCount}
                products={products}
                onChangePage={onChangePage}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
        </HomePageLayout>
    );
}

function HomePageLayout({ children }) {
    return (
        <main className="container mx-auto relative grid grid-cols-5 gap-5 items-start">
            {children}
        </main>
    );
}
