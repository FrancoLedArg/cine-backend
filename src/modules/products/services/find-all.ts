import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const products = await db.query.products.findMany();

    return products;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the products",
    );
  }
};
