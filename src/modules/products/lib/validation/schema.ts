import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive(),
  stock: z.number().int().min(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
