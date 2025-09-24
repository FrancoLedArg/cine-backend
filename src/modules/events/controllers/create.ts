import { Request, Response, NextFunction } from "express";

// Services
import { insert } from "@/modules/events/services";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await insert(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
