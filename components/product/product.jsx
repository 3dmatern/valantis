import { ProductWrapper } from "@/components/product/ui/product-wrapper";
import { ProductCard } from "./ui/product-card";
import { ProductPagination } from "./product-pagination";

export function Product({
    currentPage,
    pages,
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
                pages={pages}
                onChangePage={onChangePage}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
        </>
    );
}
