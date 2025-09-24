import { Router } from "express";
import { validateRequest } from "@/lib/validation";

// Controllers
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers";

// Validation Schemas
import {
  createTicketSchema,
  updateTicketSchema,
} from "../lib/validation/schema";

const router = Router();

router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.post("/", validateRequest({ body: createTicketSchema }), createTicket);
router.patch(
  "/:id",
  validateRequest({ body: updateTicketSchema }),
  updateTicket,
);
router.delete("/:id", deleteTicket);

export default router;
