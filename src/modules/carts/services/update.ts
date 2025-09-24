import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { carts, user } from "@/lib/db/schema";

// DTOs
import { UpdateCartDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const update = async (id: number, changes: UpdateCartDTO) => {
  try {
    const updatedCart = await db.transaction(async (tx) => {
      const existingCart = await tx.query.carts.findFirst({
        where: eq(carts.id, id),
      });

      if (!existingCart) {
        throw new NotFoundError("Cart not found");
      }

      // If updating user_id, check if new user exists
      if (changes.user_id) {
        const existingUser = await tx.query.user.findFirst({
          where: eq(user.id, changes.user_id),
        });

        if (!existingUser) {
          throw new NotFoundError("User not found");
        }
      }

      const [updatedCart] = await tx
        .update(carts)
        .set({
          ...changes,
          updated_at: new Date(),
        })
        .where(eq(carts.id, id))
        .returning();

      if (!updatedCart) {
        throw new DatabaseError("Failed to update the cart");
      }

      return updatedCart;
    });

    return updatedCart;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the cart",
    );
  }
};
