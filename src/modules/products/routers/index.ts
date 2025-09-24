import { Router } from "express";
import { validateRequest } from "@/lib/validation";

// Controllers
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers";

// Validation Schemas
import {
  createProductSchema,
  updateProductSchema,
} from "../lib/validation/schema";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", validateRequest({ body: createProductSchema }), createProduct);
router.patch(
  "/:id",
  validateRequest({ body: updateProductSchema }),
  updateProduct,
);
router.delete("/:id", deleteProduct);

export default router;
