"use client";

import { useProductIDs } from "@/hooks/use-product-ids";
import { usePaginate } from "@/hooks/use-paginate";
import { useProduct } from "@/hooks/use-product";

import { Product } from "@/components/product";
import { ProductFilterForm } from "@/components/product/product-filter-form";

export default function Home() {
    const { productIDs } = useProductIDs();
    const {
        currentPage,
        currentItems: productIDsCrop,
        pageCount,
        onChangePage,
        onClickPrevPage,
        onClickNextPage,
    } = usePaginate(productIDs);
    const { products, productBrands } = useProduct(productIDsCrop);

    return (
        <HomePageLayout>
            <ProductFilterForm brands={productBrands} />
            <Product
                className="col-span-4"
                currentPage={currentPage}
                pageCount={pageCount}
                onChangePage={onChangePage}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
                products={products}
            />
        </HomePageLayout>
    );
}

function HomePageLayout({ children }) {
    return (
        <main className="container mx-auto grid grid-cols-5 gap-5 items-start">
            {children}
        </main>
    );
}
