import { db } from "@/lib/db";

// Schema
import { infoSlides } from "@/lib/db/schema";

// DTOs
// import { CreateShowtimeDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const insert = async (data: any) => {
  try {
    const newInfoSlide = await db.insert(infoSlides).values(data).returning();

    return newInfoSlide;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the showtime",
    );
  }
};
