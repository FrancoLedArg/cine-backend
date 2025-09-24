import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { products } from "@/lib/db/schema";

// DTOs
import { UpdateProductDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const update = async (id: number, changes: UpdateProductDTO) => {
  try {
    const updatedProduct = await db.transaction(async (tx) => {
      const existingProduct = await tx.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!existingProduct) {
        throw new NotFoundError("Product not found");
      }

      const [updatedProduct] = await tx
        .update(products)
        .set({
          ...changes,
          updated_at: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) {
        throw new DatabaseError("Failed to update the product");
      }

      return updatedProduct;
    });

    return updatedProduct;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while updating the product",
    );
  }
};
