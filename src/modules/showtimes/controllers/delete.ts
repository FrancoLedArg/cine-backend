import { Request, Response, NextFunction } from "express";

// Services
import { remove } from "@/modules/showtimes/services";

// DTOs
import { GetShowtimeDTO } from "@/modules/showtimes/lib/validation/schema";

export const deleteShowtime = async (
  req: Request<GetShowtimeDTO["params"]>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const showtime = await remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Showtime deleted successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};
