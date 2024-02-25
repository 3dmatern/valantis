import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function ProductCard({ productId, brand, name, price }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>id: {productId}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Бренд: {brand}</p>
            </CardContent>
            <CardFooter>
                <p>Цена: {price}</p>
            </CardFooter>
        </Card>
    );
}
