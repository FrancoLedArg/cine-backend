import { Request, Response, NextFunction } from "express";

// Services
import { findMoviesBillboard } from "@/modules/billboard/services";

export const getMoviesBillboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const billboard = await findMoviesBillboard();

    res.status(200).json({
      success: true,
      message: "Movies billboard retrieved successfully",
      data: billboard,
    });
  } catch (error) {
    next(error);
  }
};
