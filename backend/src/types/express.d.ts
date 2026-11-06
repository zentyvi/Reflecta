import type { Handler } from "express";
import type { JwtUserPayload } from "./jwt";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload | null;
    }
  }
}
