import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { orders } from "@/lib/db/schema";

// DTOs
import { UpdateOrderDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const update = async (id: number, changes: UpdateOrderDTO) => {
  try {
    const updatedOrder = await db.transaction(async (tx) => {
      const existingOrder = await tx.query.orders.findFirst({
        where: eq(orders.id, id),
      });

      if (!existingOrder) {
        throw new NotFoundError("Order not found");
      }

      const [updatedOrder] = await tx
        .update(orders)
        .set({
          ...changes,
          updated_at: new Date(),
        })
        .where(eq(orders.id, id))
        .returning();

      if (!updatedOrder) {
        throw new DatabaseError("Failed to update the order");
      }

      return updatedOrder;
    });

    return updatedOrder;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the order",
    );
  }
};
