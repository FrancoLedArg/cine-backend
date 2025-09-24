import { Request, Response, NextFunction } from "express";

// Services
import { findById } from "@/modules/events/services";

// DTOs
import { GetEventDTO } from "@/modules/events/lib/validation/schema";

export const getEventById = async (
  req: Request<GetEventDTO["params"]>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
