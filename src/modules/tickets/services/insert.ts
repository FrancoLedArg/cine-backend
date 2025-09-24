import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// Schema
import { tickets, showtimes, user } from "@/lib/db/schema";

// DTOs
import { CreateTicketDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const insert = async (data: CreateTicketDTO) => {
  try {
    const newTicket = await db.transaction(async (tx) => {
      // Check if user exists
      const existingUser = await tx.query.user.findFirst({
        where: eq(user.id, data.user_id),
      });

      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      // Check if showtime exists and has available seats
      const showtime = await tx.query.showtimes.findFirst({
        where: eq(showtimes.id, data.showtime_id),
      });

      if (!showtime) {
        throw new NotFoundError("Showtime not found");
      }

      if (showtime.available_seats <= 0) {
        throw new ConflictError("No seats available for this showtime");
      }

      // Check if seat is already taken
      const existingTicket = await tx.query.tickets.findFirst({
        where: and(
          eq(tickets.showtime_id, data.showtime_id),
          eq(tickets.seat_number, data.seat_number),
        ),
      });

      if (existingTicket) {
        throw new ConflictError("This seat is already taken");
      }

      // Create ticket and update available seats
      const [createdTicket] = await tx.insert(tickets).values(data).returning();

      if (!createdTicket) {
        throw new DatabaseError("Failed to create the ticket");
      }

      // Update available seats
      await tx
        .update(showtimes)
        .set({
          available_seats: showtime.available_seats - 1,
          updated_at: new Date(),
        })
        .where(eq(showtimes.id, data.showtime_id));

      return createdTicket;
    });

    return newTicket;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the ticket",
    );
  }
};
