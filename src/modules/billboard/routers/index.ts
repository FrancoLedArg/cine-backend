import { Router } from "express";

// Controllers
import {
  getMoviesBillboard,
  getEventsBillboard,
  getInfoBillboard,
} from "@/modules/billboard/controllers";

const router = Router();

router.get("/movies", getMoviesBillboard);
router.get("/events", getEventsBillboard);
router.get("/info", getInfoBillboard);

export default router;
