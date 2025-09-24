import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import {
  carts,
  orders,
  orderProducts,
  orderTickets,
  cartProducts,
  cartTickets,
} from "@/lib/db/schema";

// DTOs
import { CreateOrderFromCartDTO } from "../lib/validation/schema";

// Custom Errors
import { NotFoundError, DatabaseError } from "@/utils/custom-errors";

export const createFromCart = async (data: CreateOrderFromCartDTO) => {
  try {
    const newOrder = await db.transaction(async (tx) => {
      // Get cart with all its items
      const cart = await tx.query.carts.findFirst({
        where: eq(carts.id, data.cart_id),
        with: {
          cartProducts: true,
          cartTickets: true,
        },
      });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      // Calculate total amount
      let totalAmount = 0;

      // Get products prices
      const productIds = cart.cartProducts.map((cp) => cp.product_id);
      const products = await tx.query.products.findMany({
        where: (products, { inArray }) => inArray(products.id, productIds),
      });

      for (const cartProduct of cart.cartProducts) {
        const product = products.find((p) => p.id === cartProduct.product_id);
        if (product) {
          totalAmount += product.price * cartProduct.quantity;
        }
      }

      // Create order
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          user_id: cart.user_id,
          total_amount: totalAmount,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (!createdOrder) {
        throw new DatabaseError("Failed to create order");
      }

      // Move products from cart to order
      if (cart.cartProducts.length > 0) {
        await tx.insert(orderProducts).values(
          cart.cartProducts.map((cp) => ({
            order_id: createdOrder.id,
            product_id: cp.product_id,
            quantity: cp.quantity,
          })),
        );
      }

      // Move tickets from cart to order
      if (cart.cartTickets.length > 0) {
        await tx.insert(orderTickets).values(
          cart.cartTickets.map((ct) => ({
            order_id: createdOrder.id,
            ticket_id: ct.ticket_id,
          })),
        );
      }

      // Delete cart items
      if (cart.cartProducts.length > 0) {
        await tx.delete(cartProducts).where(eq(cartProducts.cart_id, cart.id));
      }
      if (cart.cartTickets.length > 0) {
        await tx.delete(cartTickets).where(eq(cartTickets.cart_id, cart.id));
      }

      // Delete cart
      await tx.delete(carts).where(eq(carts.id, cart.id));

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
    if (error instanceof NotFoundError || error instanceof DatabaseError) {
      throw error;
    }

    throw new DatabaseError(
      "An unexpected error ocurred while creating the order from cart",
    );
  }
};
