import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { events } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const remove = async (id: number) => {
  try {
    const removedEvent = await db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, id),
      });

      if (!existingEvent) {
        throw new NotFoundError("Event not found");
      }

      const [removedEvent] = await tx
        .delete(events)
        .where(eq(events.id, id))
        .returning();

      if (!removedEvent) {
        throw new DatabaseError("Failed to delete the event");
      }

      return removedEvent;
    });

    return removedEvent;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while deleting the event",
    );
  }
};
