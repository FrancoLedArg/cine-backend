import { Request, Response, NextFunction } from "express";

// Services
import { findById } from "@/modules/showtimes/services";

// DTOs
import { GetShowtimeDTO } from "@/modules/showtimes/lib/validation/schema";

export const getShowtimeById = async (
  req: Request<GetShowtimeDTO["params"]>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const showtime = await findById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Showtime retrieved successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};
