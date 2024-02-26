import { z } from "zod";

export const ProductFilterSchema = z.object({
    brands: z.array(z.string()),
    price: z.string(),
});
