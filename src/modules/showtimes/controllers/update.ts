import { Request, Response, NextFunction } from "express";

// Services
import { update } from "@/modules/showtimes/services";

// DTOs
import { UpdateShowtimeDTO } from "@/modules/showtimes/lib/validation/schema";

export const updateShowtime = async (
  req: Request<UpdateShowtimeDTO["params"]>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const showtime = await update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Showtime updated successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};
