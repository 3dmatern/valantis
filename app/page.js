"use client";

import { Home } from "@/components/home";
import { useProduct } from "@/hooks/use-product";

export default function HomePage() {
    const { productIDs } = useProduct();
    return (
        <main>
            <Home />
        </main>
    );
}
