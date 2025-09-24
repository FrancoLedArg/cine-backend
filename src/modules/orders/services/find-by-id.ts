import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { orders } from "@/lib/db/schema";

// Custom Error
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const findById = async (id: number) => {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: true,
        orderProducts: true,
        orderTickets: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;

    throw new DatabaseError(
      "An unexpected error ocurred while retrieving the order",
    );
  }
};
