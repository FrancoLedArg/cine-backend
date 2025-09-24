import { Router } from "express";
import { validateRequest } from "@/lib/validation";

// Controllers
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  createOrderFromCart,
} from "../controllers";

// Validation Schemas
import {
  createOrderSchema,
  updateOrderSchema,
  createOrderFromCartSchema,
} from "../lib/validation/schema";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", validateRequest({ body: createOrderSchema }), createOrder);
router.post(
  "/from-cart",
  validateRequest({ body: createOrderFromCartSchema }),
  createOrderFromCart,
);
router.patch("/:id", validateRequest({ body: updateOrderSchema }), updateOrder);

export default router;
