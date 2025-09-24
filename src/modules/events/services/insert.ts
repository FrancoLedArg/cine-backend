import { db } from "@/lib/db";

// Schema
import { events } from "@/lib/db/schema";

// DTOs
import { CreateEventDTO } from "@/modules/events/lib/validation/schema";

// Custom Errors
import { DatabaseError } from "@/utils/custom-errors";

export const insert = async (data: CreateEventDTO["body"]) => {
  try {
    const [newEvent] = await db.insert(events).values(data).returning();

    if (!newEvent) {
      throw new DatabaseError("Failed to create the event");
    }

    return newEvent;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while creating the event",
    );
  }
};
