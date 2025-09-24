import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const events = await db.query.events.findMany({
      with: {
        showtimes: true,
      },
    });

    return events;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the events",
    );
  }
};
