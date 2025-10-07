import { Request, Response, NextFunction } from "express";

// Services
import { findInfoBillboard } from "@/modules/billboard/services";

export const getInfoBillboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const billboard = await findInfoBillboard();

    res.status(200).json({
      success: true,
      message: "Info billboard retrieved successfully",
      data: billboard,
    });
  } catch (error) {
    next(error);
  }
};
