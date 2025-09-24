import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { products } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the product",
    );
  }
};
