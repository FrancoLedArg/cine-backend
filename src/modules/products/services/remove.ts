import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { products } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const remove = async (id: number) => {
  try {
    const removedProduct = await db.transaction(async (tx) => {
      const existingProduct = await tx.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!existingProduct) {
        throw new NotFoundError("Product not found");
      }

      const [removedProduct] = await tx
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      if (!removedProduct) {
        throw new DatabaseError("Failed to delete the product");
      }

      return removedProduct;
    });

    return removedProduct;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while deleting the product",
    );
  }
};
