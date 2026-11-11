import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../../types/jwt";
import { getFromEnv } from "../../utils/helpers.ts";

const authorizeUser: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, getFromEnv("SECRET"));
    req.user = decoded as JwtUserPayload;
  } catch (err) {
    req.user = null;
  }
  next();
};

export default authorizeUser;
