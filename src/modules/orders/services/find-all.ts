import { db } from "@/lib/db";

// Custom Error
import { DatabaseError } from "@/utils/custom-errors";

export const findAll = async () => {
  try {
    const orders = await db.query.orders.findMany({
      with: {
        user: true,
        orderProducts: true,
        orderTickets: true,
      },
    });

    return orders;
  } catch (error) {
    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the orders",
    );
  }
};
