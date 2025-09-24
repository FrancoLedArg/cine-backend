import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { tickets } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const ticket = await db.query.tickets.findFirst({
      where: eq(tickets.id, id),
      with: {
        user: true,
        showtime: {
          with: {
            event: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    return ticket;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the ticket",
    );
  }
};
