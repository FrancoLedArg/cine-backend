import { z } from "zod";

const eventTypesSchema = z.enum(["movie", "theater"], {
  message: "Invalid event type",
});

export const getEventSchema = z.object({
  params: z.object({
    id: z.number().int().positive(),
  }),
});

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    type: eventTypesSchema.default("movie"),
    duration: z.number().int().positive().optional(),
    posterUrl: z.url().optional(),
    bannerUrl: z.url().optional(),
    trailerUrl: z.url().optional(),
  }),
});

export const updateEventSchema = z.object({
  params: getEventSchema.shape.params,
  body: createEventSchema.shape.body.partial(),
});

export type GetEventDTO = z.infer<typeof getEventSchema>;
export type CreateEventDTO = z.infer<typeof createEventSchema>;
export type UpdateEventDTO = z.infer<typeof updateEventSchema>;
