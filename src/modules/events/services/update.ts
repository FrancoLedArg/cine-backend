import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { events } from "@/lib/db/schema";

// DTOs
import { UpdateEventDTO } from "@/modules/events/lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const update = async (id: number, changes: UpdateEventDTO["body"]) => {
  try {
    const updatedEvent = await db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, id),
      });

      if (!existingEvent) {
        throw new NotFoundError("Event not found");
      }

      const [updatedEvent] = await tx
        .update(events)
        .set({ ...changes })
        .where(eq(events.id, id))
        .returning();

      if (!updatedEvent) {
        throw new DatabaseError("Failed to update the event");
      }

      return updatedEvent;
    });

    return updatedEvent;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the event",
    );
  }
};
