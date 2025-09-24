import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { carts } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const remove = async (id: number) => {
  try {
    const removedCart = await db.transaction(async (tx) => {
      const existingCart = await tx.query.carts.findFirst({
        where: eq(carts.id, id),
      });

      if (!existingCart) {
        throw new NotFoundError("Cart not found");
      }

      const [removedCart] = await tx
        .delete(carts)
        .where(eq(carts.id, id))
        .returning();

      if (!removedCart) {
        throw new DatabaseError("Failed to delete the cart");
      }

      return removedCart;
    });

    return removedCart;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while deleting the cart",
    );
  }
};
