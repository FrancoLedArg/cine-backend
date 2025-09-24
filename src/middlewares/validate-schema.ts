import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject } from "zod";

export const validateSchema =
  (schema: ZodObject): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        params: req.params,
        body: req.body,
        query: req.query,
      });

      if (!result.success) {
        res.status(400).json({
          type: "Validation Error",
          data: result.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }

      next();
    } catch (error) {
      // Later will replace this for logger
      console.error("Validation middleware error:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
