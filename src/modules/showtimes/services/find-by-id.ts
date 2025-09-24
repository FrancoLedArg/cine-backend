import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { showtimes } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const showtime = await db.query.showtimes.findFirst({
      where: eq(showtimes.id, id),
      with: {
        event: true,
        seats: true,
      },
    });

    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }

    return showtime;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the showtime",
    );
  }
};
