import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { showtimes } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const remove = async (id: number) => {
  try {
    const removedShowtime = await db.transaction(async (tx) => {
      const existingShowtime = await tx.query.showtimes.findFirst({
        where: eq(showtimes.id, id),
      });

      if (!existingShowtime) {
        throw new NotFoundError("Showtime not found");
      }

      const [removedShowtime] = await tx
        .delete(showtimes)
        .where(eq(showtimes.id, id))
        .returning();

      if (!removedShowtime) {
        throw new DatabaseError("Failed to delete the showtime");
      }

      return removedShowtime;
    });

    return removedShowtime;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while deleting the showtime",
    );
  }
};
