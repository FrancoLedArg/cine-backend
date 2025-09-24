import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import {
  orders,
  orderProducts,
  orderTickets,
  products,
  tickets,
  showtimes,
  user,
} from "@/lib/db/schema";

// DTOs
import { CreateOrderDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const insert = async (data: CreateOrderDTO) => {
  try {
    const newOrder = await db.transaction(async (tx) => {
      // Check if user exists
      const existingUser = await tx.query.user.findFirst({
        where: eq(user.id, data.user_id),
      });

      if (!existingUser) {
        throw new NotFoundError("User not found");
      }

      // Validate products
      for (const product of data.products) {
        const existingProduct = await tx.query.products.findFirst({
          where: eq(products.id, product.product_id),
        });

        if (!existingProduct) {
          throw new NotFoundError(`Product ${product.product_id} not found`);
        }

        if (existingProduct.stock < product.quantity) {
          throw new ConflictError(
            `Not enough stock for product ${product.product_id}`,
          );
        }
      }

      // Validate tickets (seats availability)
      for (const ticket of data.tickets) {
        // Check if showtime exists and has available seats
        const showtime = await tx.query.showtimes.findFirst({
          where: eq(showtimes.id, ticket.showtime_id),
        });

        if (!showtime) {
          throw new NotFoundError(`Showtime ${ticket.showtime_id} not found`);
        }

        if (showtime.available_seats <= 0) {
          throw new ConflictError(
            `No seats available for showtime ${ticket.showtime_id}`,
          );
        }

        // Check if seat is already taken
        const existingTicket = await tx.query.tickets.findFirst({
          where: and(
            eq(tickets.showtime_id, ticket.showtime_id),
            eq(tickets.seat_number, ticket.seat_number),
          ),
        });

        if (existingTicket) {
          throw new ConflictError(
            `Seat ${ticket.seat_number} is already taken for showtime ${ticket.showtime_id}`,
          );
        }
      }

      // Create order
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          user_id: data.user_id,
          total_amount: data.total_amount,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (!createdOrder) {
        throw new DatabaseError("Failed to create order");
      }

      // Create tickets and add them to order
      for (const ticketData of data.tickets) {
        // Create ticket
        const [createdTicket] = await tx
          .insert(tickets)
          .values({
            user_id: data.user_id,
            showtime_id: ticketData.showtime_id,
            seat_number: ticketData.seat_number,
          })
          .returning();

        if (!createdTicket) {
          throw new DatabaseError("Failed to create ticket");
        }

        // Add ticket to order
        await tx.insert(orderTickets).values({
          order_id: createdOrder.id,
          ticket_id: createdTicket.id,
        });

        // Update available seats
        await tx
          .update(showtimes)
          .set({
            available_seats: {
              decrement: 1,
            },
            updated_at: new Date(),
          })
          .where(eq(showtimes.id, ticketData.showtime_id));
      }

      // Add products to order and update stock
      for (const productData of data.products) {
        // Add product to order
        await tx.insert(orderProducts).values({
          order_id: createdOrder.id,
          product_id: productData.product_id,
          quantity: productData.quantity,
        });

        // Update product stock
        await tx
          .update(products)
          .set({
            stock: {
              decrement: productData.quantity,
            },
            updated_at: new Date(),
          })
          .where(eq(products.id, productData.product_id));
      }

      // Return complete order
      const completeOrder = await tx.query.orders.findFirst({
        where: eq(orders.id, createdOrder.id),
        with: {
          orderProducts: true,
          orderTickets: true,
        },
      });

      if (!completeOrder) {
        throw new DatabaseError("Failed to retrieve created order");
      }

      return completeOrder;
    });

    return newOrder;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the order",
    );
  }
};
