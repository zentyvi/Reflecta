import type { Handler } from "express";
import type { JwtUserPayload } from "../@types/jwt";
import jwt from "jsonwebtoken";
import { getFromEnv } from "../utils/helpers.ts";

export const authorizeUser: Handler = (req, res, next) => {
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

export const protectRoute: Handler = (req, res, next) => {
  const user = req?.user;
  if (!user) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token", action: "DELETE_TOKEN" });
  }
  next();
};
