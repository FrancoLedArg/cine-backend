import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

// Schema
import { carts, user } from "@/lib/db/schema";

// DTOs
import { CreateCartDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const insert = async (data: CreateCartDTO) => {
  try {
    const newCart = await db.transaction(async (tx) => {
      // Check if user exists
      const existingUser = await tx.query.user.findFirst({
        where: eq(user.id, data.user_id),
      });

      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      const [createdCart] = await tx
        .insert(carts)
        .values({
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (!createdCart) {
        throw new DatabaseError("Failed to create the cart");
      }

      return createdCart;
    });

    return newCart;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the cart",
    );
  }
};
