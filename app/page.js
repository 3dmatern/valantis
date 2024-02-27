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
        <main className="container min-w-[390px] mx-auto md:p-5 p-4 relative grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 items-start">
            {children}
        </main>
    );
}
