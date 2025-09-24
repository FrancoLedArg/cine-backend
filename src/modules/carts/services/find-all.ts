import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const carts = await db.query.carts.findMany({
      with: {
        user: true,
        cartProducts: true,
        cartTickets: true,
      },
    });

    return carts;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the carts",
    );
  }
};
