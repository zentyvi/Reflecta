import type {
  ApiSuccess,
  ApiBusinessError,
  ApiSystemError,
} from "@shared/api/common.d.ts";

export function makeSuccessResponse<responseBody>(
  data: responseBody,
): ApiSuccess<responseBody> {
  return {
    success: true,
    data,
  };
}

export function makeBusinessErrorResponse<responseErrors>(
  data: Omit<ApiBusinessError<responseErrors>, "success" | "errorType">,
): ApiBusinessError<responseErrors> {
  return {
    ...data,
    success: false,
    errorType: "BUSINESS"
  };
}

export function makeSystemErrorResponse(
  data: Omit<ApiSystemError, "success" | "errorType">,
): ApiSystemError {
  return {
    ...data,
    success: false,
    errorType: "SYSTEM",
  };
}
