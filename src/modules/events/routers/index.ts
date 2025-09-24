import { Router } from "express";
import { validateSchema } from "@/middlewares/validate-schema";

// Controllers
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/modules/events/controllers";

// Validation Schemas
import {
  createEventSchema,
  updateEventSchema,
} from "@/modules/events/lib/validation/schema";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", validateSchema(createEventSchema), createEvent);
// @ts-ignore
router.patch("/:id", validateSchema(updateEventSchema), updateEvent);
router.delete("/:id", deleteEvent);

export default router;
