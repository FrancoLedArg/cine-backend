import { z } from "zod";

export const createOrderFromCartSchema = z.object({
  cart_id: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  user_id: z.string().min(1),
  total_amount: z.number().int().positive(),
  products: z.array(
    z.object({
      product_id: z.number().int().positive(),
      quantity: z.number().int().positive(),
    }),
  ),
  tickets: z.array(
    z.object({
      showtime_id: z.number().int().positive(),
      seat_number: z.number().int().positive(),
    }),
  ),
});

export const updateOrderSchema = z
  .object({
    total_amount: z.number().int().positive(),
  })
  .partial();

export type CreateOrderFromCartDTO = z.infer<typeof createOrderFromCartSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;
