import { db } from "@/lib/db";
import { and, gte, lte, asc } from "drizzle-orm";

// Schema
import { showtimes } from "@/lib/db/schema";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findMoviesBillboard = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setHours(today.getDate() + 1);

    const billboard = await db.query.showtimes.findMany({
      where: and(
        gte(showtimes.start_datetime, today),
        lte(showtimes.start_datetime, tomorrow),
      ),
      with: {
        movie: true,
      },
      orderBy: asc(showtimes.start_datetime),
    });

    if (!billboard) {
      throw new DatabaseError("Movies billboard not found");
    }

    return billboard;
  } catch (error: unknown) {
    if (error instanceof DatabaseError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the movies billboard",
    );
  }
};
