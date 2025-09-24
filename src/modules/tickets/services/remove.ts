import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { tickets, showtimes } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const remove = async (id: number) => {
  try {
    const removedTicket = await db.transaction(async (tx) => {
      const existingTicket = await tx.query.tickets.findFirst({
        where: eq(tickets.id, id),
        with: {
          showtime: true,
        },
      });

      if (!existingTicket) {
        throw new NotFoundError("Ticket not found");
      }

      const [removedTicket] = await tx
        .delete(tickets)
        .where(eq(tickets.id, id))
        .returning();

      if (!removedTicket) {
        throw new DatabaseError("Failed to delete the ticket");
      }

      // Update available seats
      await tx
        .update(showtimes)
        .set({
          available_seats: existingTicket.showtime.available_seats + 1,
          updated_at: new Date(),
        })
        .where(eq(showtimes.id, existingTicket.showtime_id));

      return removedTicket;
    });

    return removedTicket;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while deleting the ticket",
    );
  }
};
