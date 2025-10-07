import { Router } from "express";
import { validateSchema } from "@/middlewares/validate-schema";

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
router.post("/", validateSchema(createTicketSchema), createTicket);
router.patch("/:id", validateSchema(updateTicketSchema), updateTicket);
router.delete("/:id", deleteTicket);

export default router;
