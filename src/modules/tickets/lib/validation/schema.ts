import { z } from "zod";

export const createTicketSchema = z.object({
  user_id: z.string().min(1),
  showtime_id: z.number().int().positive(),
  seat_number: z.number().int().positive(),
});

export const updateTicketSchema = createTicketSchema.partial();

export type CreateTicketDTO = z.infer<typeof createTicketSchema>;
export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;
