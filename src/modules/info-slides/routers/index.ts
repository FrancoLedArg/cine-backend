import { Router } from "express";
import { validateSchema } from "@/middlewares/validate-schema";

// Validation Schemas
import {
  createShowtimeSchema,
  updateShowtimeSchema,
} from "@/modules/showtimes/lib/validation/schema";

// Controllers
import {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from "@/modules/showtimes/controllers";

const router = Router();

router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);
router.post("/", validateSchema(createShowtimeSchema), createShowtime);
// @ts-ignore
router.patch("/:id", validateSchema(updateShowtimeSchema), updateShowtime);
router.delete("/:id", deleteShowtime);

export default router;
