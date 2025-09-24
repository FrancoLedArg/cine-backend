import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const tickets = await db.query.tickets.findMany({
      with: {
        user: true,
        showtime: {
          with: {
            event: true,
          },
        },
      },
    });

    return tickets;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the tickets",
    );
  }
};
