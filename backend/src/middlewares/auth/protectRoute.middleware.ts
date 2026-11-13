import type { AppMiddleware } from "../../types/express";

const protectRoute: AppMiddleware = (req, res, next) => {
  const user = req?.user;
  if (!user) {
    return next({
      message: "Invalid or expired token",
      statusCode: 403,
      actions: ["DELETE_TOKEN"],
    });
  }
  next();
};

export default protectRoute;
