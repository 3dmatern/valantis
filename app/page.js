"use client";

import { useProduct } from "@/hooks/use-product";

import { Home } from "@/components/home";

export default function HomePage() {
    const { products } = useProduct();

    return (
        <HomePageLayout>
            <Home products={products} />
        </HomePageLayout>
    );
}

function HomePageLayout({ children }) {
    return <main className="container mx-auto">{children}</main>;
}
