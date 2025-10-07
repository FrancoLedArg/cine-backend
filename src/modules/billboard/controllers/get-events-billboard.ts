import { Request, Response, NextFunction } from "express";

// Services
import { findAll } from "@/modules/events/services";

export const getEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const events = await findAll();

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
