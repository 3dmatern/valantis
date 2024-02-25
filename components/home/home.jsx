import { ProductWrapper } from "@/components/home/ui/product-wrapper";
import { ProductCard } from "./ui/product-card";

export function Home({ products }) {
    return (
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
    );
}
