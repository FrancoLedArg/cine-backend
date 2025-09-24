import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { events } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const event = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    return event;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the event",
    );
  }
};
