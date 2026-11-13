import type { ApiSystemError } from "@shared/api/common.js";
import type { GlobalErrorHablder } from "../types/express";

const globalErrorHanlder: GlobalErrorHablder = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const actions = err.actions || undefined;
  const message = err.message || "Internal server error";

  const errorResponseData: ApiSystemError = {
    errorType: "SYSTEM",
    success: false,
    statusCode: statusCode,
    message: message,
    actions,
  };
  res.status(statusCode).json(errorResponseData);
};

export default globalErrorHanlder;
