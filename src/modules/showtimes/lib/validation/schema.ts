import { z } from "zod";

export const getShowtimeSchema = z.object({
  params: z.object({
    id: z.number().int().positive(),
  }),
});

export const createShowtimeSchema = z.object({
  body: z.object({
    event_id: z.number().int().positive(),
    start_datetimes: z.array(z.date()),
    seat_categories: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number().int().positive(),
      }),
    ),
    seats: z.array(
      z.object({
        section: z.string(),
        row: z.string(),
        number: z.number().int().positive(),
        status: z.string(),
        category_name: z.string(),
      }),
    ),
  }),
});

export const updateShowtimeSchema = z.object({
  params: getShowtimeSchema.shape.params,
  body: z.object({
    start_datetime: z.date(),
  }),
});

export type GetShowtimeDTO = z.infer<typeof getShowtimeSchema>;
export type CreateShowtimeDTO = z.infer<typeof createShowtimeSchema>;
export type UpdateShowtimeDTO = z.infer<typeof updateShowtimeSchema>;
/*

Example of the showtime request body

{
  "event_id": 1,
  "start_datetimes": ["2025-01-01 00:00:00", "2025-01-01 00:00:00"],
  "seat_categories": [
    {
      "name": "Main",
      "description": "Main section",
      "price": 100
    }
  ],
  "seats": [
    {
      "section": "main",
      "row": 1,
      "number": 1,
      "status": "available",
      "category_name": "Main"
    }
  ]
}


*/
