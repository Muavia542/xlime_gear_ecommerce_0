import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Browser CSRF / cross-site request guard.
 * SameSite cookies are the first layer; Origin and Fetch-Metadata checks add defense in depth.
 */
export function originGuard(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const fetchSite = req.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    res.status(403).json({ error: { code: "CROSS_SITE_REJECTED", message: "Cross-site state-changing requests are not allowed." } });
    return;
  }

  const origin = req.get("origin");
  if (origin && origin !== env.FRONTEND_ORIGIN) {
    res.status(403).json({ error: { code: "ORIGIN_REJECTED", message: "Request origin is not allowed." } });
    return;
  }
  next();
}
