import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

// Schema
import { carts, products, cartProducts } from "@/lib/db/schema";

// DTOs
import { AddCartProductDTO } from "../lib/validation/schema";

// Custom Errors
import {
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "@/utils/custom-errors";

export const addProduct = async (cartId: number, data: AddCartProductDTO) => {
  try {
    const updatedCart = await db.transaction(async (tx) => {
      // Check if cart exists
      const cart = await tx.query.carts.findFirst({
        where: eq(carts.id, cartId),
      });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      // Check if product exists and has enough stock
      const product = await tx.query.products.findFirst({
        where: eq(products.id, data.product_id),
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      if (product.stock < data.quantity) {
        throw new ConflictError("Not enough stock available");
      }

      // Add product to cart
      await tx.insert(cartProducts).values({
        cart_id: cartId,
        product_id: data.product_id,
        quantity: data.quantity,
      });

      // Update product stock
      await tx
        .update(products)
        .set({
          stock: product.stock - data.quantity,
          updated_at: new Date(),
        })
        .where(eq(products.id, data.product_id));

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
      "An unexpected error ocurred while adding product to cart",
    );
  }
};
