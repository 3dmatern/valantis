import { z } from "zod";

export const ProductFilterSchema = z
    .object({
        product: z.string(),
        brand: z.array(z.string()),
        price: z.string(),
    })
    .refine(({ product, brand, price }) => {
        if (product === "" && brand.length === 0 && price === "") {
            return false;
        }
        return true;
    });
