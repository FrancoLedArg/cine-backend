import { Router } from "express";
import { validateSchema } from "@/middlewares/validate-schema";

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
router.post("/", validateSchema(createProductSchema), createProduct);
router.patch("/:id", validateSchema(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
