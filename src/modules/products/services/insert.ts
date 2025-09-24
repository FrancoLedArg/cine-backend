import { db } from "@/lib/db";

// Schema
import { products } from "@/lib/db/schema";

// DTOs
import { CreateProductDTO } from "../lib/validation/schema";

// Custom Errors
import { DatabaseError } from "@/utils/custom-errors";

export const insert = async (data: CreateProductDTO) => {
  try {
    const [createdProduct] = await db
      .insert(products)
      .values({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    if (!createdProduct) {
      throw new DatabaseError("Failed to create the product");
    }

    return createdProduct;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the product",
    );
  }
};
