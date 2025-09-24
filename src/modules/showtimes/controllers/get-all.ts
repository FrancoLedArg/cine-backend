import { Request, Response, NextFunction } from "express";

// Services
import { findAll } from "@/modules/showtimes/services";

export const getShowtimes = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const showtimes = await findAll();

    res.status(200).json({
      success: true,
      message: "Showtimes retrieved successfully",
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};
