"use client";

import { useProduct } from "@/hooks/use-product";

import { Product } from "@/components/product";

export default function Home() {
    const { products } = useProduct();

    return (
        <HomePageLayout>
            <Product products={products} />
        </HomePageLayout>
    );
}

function HomePageLayout({ children }) {
    return <main className="container mx-auto">{children}</main>;
}
