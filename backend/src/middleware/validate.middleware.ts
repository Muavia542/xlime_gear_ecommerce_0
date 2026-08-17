import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    res.status(422).json({ error: { code: "VALIDATION_ERROR", message: "Please check the submitted fields.", details: result.error.flatten() } });
    return;
  }
  const data = result.data as { body: unknown };
  req.body = data.body;
  next();
};
