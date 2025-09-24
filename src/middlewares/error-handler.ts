import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

// Custom Error
import { CustomError } from "@/utils/custom-errors";

export function errorHandler(
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof CustomError) {
    console.warn(`[${error.name}] ${error.message}`);
    console.warn(`→ ${req.method} ${req.originalUrl}`);
    console.warn(`→ Status: ${error.statusCode}`);

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(`[UnexpectedError]`);
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Unexpected server error",
  });
}
