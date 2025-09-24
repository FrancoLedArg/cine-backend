import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { tickets, showtimes, user } from "@/lib/db/schema";

// DTOs
import { UpdateTicketDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const update = async (id: number, changes: UpdateTicketDTO) => {
  try {
    const updatedTicket = await db.transaction(async (tx) => {
      const existingTicket = await tx.query.tickets.findFirst({
        where: eq(tickets.id, id),
      });

      if (!existingTicket) {
        throw new NotFoundError("Ticket not found");
      }

      // If updating user_id, check if new user exists
      if (changes.user_id) {
        const existingUser = await tx.query.user.findFirst({
          where: eq(user.id, changes.user_id),
        });

        if (!existingUser) {
          throw new NotFoundError("User not found");
        }
      }

      // If updating showtime_id or seat_number, validate availability
      if (changes.showtime_id || changes.seat_number) {
        const targetShowtimeId =
          changes.showtime_id || existingTicket.showtime_id;
        const targetSeatNumber =
          changes.seat_number || existingTicket.seat_number;

        // Check if showtime exists and has available seats
        const showtime = await tx.query.showtimes.findFirst({
          where: eq(showtimes.id, targetShowtimeId),
        });

        if (!showtime) {
          throw new NotFoundError("Showtime not found");
        }

        // Only check available seats if changing to a different showtime
        if (changes.showtime_id && showtime.available_seats <= 0) {
          throw new ConflictError("No seats available for this showtime");
        }

        // Check if seat is already taken (only if changing seat or showtime)
        if (changes.showtime_id || changes.seat_number) {
          const existingSeat = await tx.query.tickets.findFirst({
            where: and(
              eq(tickets.showtime_id, targetShowtimeId),
              eq(tickets.seat_number, targetSeatNumber),
            ),
          });

          if (existingSeat && existingSeat.id !== id) {
            throw new ConflictError("This seat is already taken");
          }
        }

        // If changing showtime, update available seats for both old and new showtime
        if (
          changes.showtime_id &&
          changes.showtime_id !== existingTicket.showtime_id
        ) {
          // Increase available seats in old showtime
          await tx
            .update(showtimes)
            .set({
              available_seats: {
                increment: 1,
              },
              updated_at: new Date(),
            })
            .where(eq(showtimes.id, existingTicket.showtime_id));

          // Decrease available seats in new showtime
          await tx
            .update(showtimes)
            .set({
              available_seats: {
                decrement: 1,
              },
              updated_at: new Date(),
            })
            .where(eq(showtimes.id, changes.showtime_id));
        }
      }

      const [updatedTicket] = await tx
        .update(tickets)
        .set({
          ...changes,
          updated_at: new Date(),
        })
        .where(eq(tickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new DatabaseError("Failed to update the ticket");
      }

      return updatedTicket;
    });

    return updatedTicket;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the ticket",
    );
  }
};
