import type { RequestHandler } from "express";

const protectRoute: RequestHandler = (req, res, next) => {
  const user = req?.user;
  if (!user) {
    return res.status(403).json({
      message: "Invalid or expired token",
      action: "DELETE_TOKEN",
    });
  }
  next();
};

export default protectRoute;
