import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const showtimes = await db.query.showtimes.findMany({
      with: {
        event: true,
      },
    });

    return showtimes;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the showtimes",
    );
  }
};
