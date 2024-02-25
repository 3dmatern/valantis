"use client";

import { useProductIDs } from "@/hooks/use-product-ids";
import { usePaginate } from "@/hooks/use-paginate";
import { useProduct } from "@/hooks/use-product";

import { Product } from "@/components/product";

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
    const { products } = useProduct(productIDsCrop);

    return (
        <HomePageLayout>
            <Product
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
    return <main className="container mx-auto">{children}</main>;
}
