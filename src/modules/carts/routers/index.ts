import { Router } from "express";
import { validateRequest } from "@/lib/validation";

// Controllers
import {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  addTicketToCart,
} from "../controllers";

// Validation Schemas
import {
  createCartSchema,
  updateCartSchema,
  addCartProductSchema,
  addCartTicketSchema,
} from "../lib/validation/schema";

const router = Router();

router.get("/", getAllCarts);
router.get("/:id", getCartById);
router.post("/", validateRequest({ body: createCartSchema }), createCart);
router.patch("/:id", validateRequest({ body: updateCartSchema }), updateCart);
router.delete("/:id", deleteCart);

// Cart items management
router.post(
  "/:id/products",
  validateRequest({ body: addCartProductSchema }),
  addProductToCart,
);
router.post(
  "/:id/tickets",
  validateRequest({ body: addCartTicketSchema }),
  addTicketToCart,
);

export default router;
