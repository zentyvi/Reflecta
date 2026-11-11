import type { NextFunction, Request, Response } from "express";
import type { JwtUserPayload } from "./jwt";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload | null;
    }
  }
}

// Authenticated response for protected routes,
// where the response is guaranteed to have a 'user' property

export type AuthenticatedRequest<
  P = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>,
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  user: JwtUserPayload;
};

// Protected handler where the Request has a 'user' property

export type ProtectedHandler<
  P = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>,
> = (
  req: AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => void | Promise<void | Response>;
