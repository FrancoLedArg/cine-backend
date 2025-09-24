import { db } from "@/lib/db";
import { eq, and, inArray } from "drizzle-orm";

// Schema
import { events, showtimes, seats, seatCategories } from "@/lib/db/schema";

// DTOs
import { CreateShowtimeDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const insert = async (data: CreateShowtimeDTO["body"]) => {
  try {
    const newShowtimes = await db.transaction(async (tx) => {
      // Check if event exists
      const event = await tx.query.events.findFirst({
        where: eq(events.id, data.event_id),
      });

      if (!event) {
        throw new NotFoundError("Event not found");
      }

      // Check if the showtimes exist
      const existingShowtimes = await tx.query.showtimes.findMany({
        where: and(
          eq(showtimes.event_id, data.event_id),
          inArray(showtimes.start_datetime, data.start_datetimes),
        ),
      });

      if (existingShowtimes.length > 0) {
        throw new ConflictError("One or more showtimes already exist");
      }

      // Create the showtimes
      const [newShowtime] = await tx
        .insert(showtimes)
        .values(
          data.start_datetimes.map((start_datetime) => ({
            event_id: data.event_id,
            start_datetime,
          })),
        )
        .returning();

      if (!newShowtime) {
        throw new DatabaseError("Failed to create the showtime");
      }

      // Create the seat categories
      const [newSeatCategories] = await tx
        .insert(seatCategories)
        .values(
          data.seat_categories.map((seat_category) => ({
            showtime_id: newShowtime.id,
            ...seat_category,
          })),
        )
        .returning();

      if (!newSeatCategories) {
        throw new DatabaseError("Failed to create the seat categories");
      }

      // Create the seats
      const newSeats = await tx
        .insert(seats)
        .values(
          data.seats.map((seat) => ({
            showtime_id: newShowtime.id,
            seat_section: seat.section as
              | "main"
              | "lower_balcony"
              | "upper_balcony",
            seat_row: seat.row,
            seat_number: seat.number,
            status: seat.status as "available" | "reserved" | "sold",
            category_name: seat.category_name,
          })),
        )
        .returning();

      if (!newSeats || newSeats.length !== data.seats.length) {
        throw new DatabaseError("Failed to create the seats");
      }

      // Update showtime
      const updatedShowtime = await tx.query.showtimes.findFirst({
        where: eq(showtimes.id, newShowtime.id),
        with: {
          seats: true,
        },
      });

      if (!updatedShowtime) {
        throw new DatabaseError("Failed to update the showtime");
      }

      return updatedShowtime;
    });

    return newShowtimes;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the showtime",
    );
  }
};
