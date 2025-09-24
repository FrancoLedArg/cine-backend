import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { carts } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, id),
      with: {
        user: true,
        cartProducts: true,
        cartTickets: true,
      },
    });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    return cart;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the cart",
    );
  }
};
