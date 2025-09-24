import { z } from "zod";

export const createCartSchema = z.object({
  user_id: z.string().min(1),
  expires_at: z.string().datetime().optional(),
});

export const addCartProductSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const addCartTicketSchema = z.object({
  showtime_id: z.number().int().positive(),
  seat_number: z.number().int().positive(),
});

export const updateCartSchema = createCartSchema.partial();

export type CreateCartDTO = z.infer<typeof createCartSchema>;
export type AddCartProductDTO = z.infer<typeof addCartProductSchema>;
export type AddCartTicketDTO = z.infer<typeof addCartTicketSchema>;
export type UpdateCartDTO = z.infer<typeof updateCartSchema>;
