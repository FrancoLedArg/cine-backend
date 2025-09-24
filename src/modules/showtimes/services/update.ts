import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { showtimes } from "@/lib/db/schema";

// DTOs
import { UpdateShowtimeDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const update = async (
  id: number,
  changes: UpdateShowtimeDTO["body"],
) => {
  try {
    const updatedShowtime = await db.transaction(async (tx) => {
      const existingShowtime = await tx.query.showtimes.findFirst({
        where: eq(showtimes.id, id),
      });

      if (!existingShowtime) {
        throw new NotFoundError("Showtime not found");
      }

      const [updatedShowtime] = await tx
        .update(showtimes)
        .set({
          ...changes,
        })
        .where(eq(showtimes.id, id))
        .returning();

      if (!updatedShowtime) {
        throw new DatabaseError("Failed to update the showtime");
      }

      return updatedShowtime;
    });

    return updatedShowtime;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the showtime",
    );
  }
};
