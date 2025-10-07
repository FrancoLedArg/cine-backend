import { Request, Response, NextFunction } from "express";

// Services
import { insert } from "@/modules/showtimes/services";

export const createShowtime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const showtime = await insert(req.body);

    res.status(201).json({
      success: true,
      message: "Showtime created successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};
