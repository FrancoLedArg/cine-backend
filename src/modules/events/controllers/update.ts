import { Request, Response, NextFunction } from "express";

// Services
import { update } from "@/modules/events/services";

// DTOs
import { UpdateEventDTO } from "@/modules/events/lib/validation/schema";

export const updateEvent = async (
  req: Request<UpdateEventDTO["params"]>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
