import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { carts, showtimes, tickets, cartTickets } from "@/lib/db/schema";

// DTOs
import { AddCartTicketDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const addTicket = async (cartId: number, data: AddCartTicketDTO) => {
  try {
    const updatedCart = await db.transaction(async (tx) => {
      // Check if cart exists
      const cart = await tx.query.carts.findFirst({
        where: eq(carts.id, cartId),
      });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      // Check if showtime exists and has available seats
      const showtime = await tx.query.showtimes.findFirst({
        where: eq(showtimes.id, data.showtime_id),
      });

      if (!showtime) {
        throw new NotFoundError("Showtime not found");
      }

      if (showtime.available_seats <= 0) {
        throw new ConflictError("No seats available for this showtime");
      }

      // Check if seat is already taken
      const existingTicket = await tx.query.tickets.findFirst({
        where: and(
          eq(tickets.showtime_id, data.showtime_id),
          eq(tickets.seat_number, data.seat_number),
        ),
      });

      if (existingTicket) {
        throw new ConflictError("This seat is already taken");
      }

      // Create ticket
      const [createdTicket] = await tx
        .insert(tickets)
        .values({
          user_id: cart.user_id,
          showtime_id: data.showtime_id,
          seat_number: data.seat_number,
        })
        .returning();

      if (!createdTicket) {
        throw new DatabaseError("Failed to create ticket");
      }

      // Add ticket to cart
      await tx.insert(cartTickets).values({
        cart_id: cartId,
        ticket_id: createdTicket.id,
      });

      // Update available seats
      await tx
        .update(showtimes)
        .set({
          available_seats: showtime.available_seats - 1,
          updated_at: new Date(),
        })
        .where(eq(showtimes.id, data.showtime_id));

      // Return updated cart
      const updatedCart = await tx.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: {
          cartProducts: true,
          cartTickets: true,
        },
      });

      if (!updatedCart) {
        throw new DatabaseError("Failed to retrieve updated cart");
      }

      return updatedCart;
    });

    return updatedCart;
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof DatabaseError
    ) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while adding ticket to cart",
    );
  }
};
