export {};

// --- Base API Architecture Types ---

// Successful response carrying domain data, pass the expected body to the generic

export type ApiSuccess<TData> = {
  success: true;
  data: TData;
}

// Business logic error (e.g., 400 Bad Request handled by controllers)

export type ApiBusinessError<TErrors = undefined> = {
  success: false;
  errorType: "BUSINESS";
  errorData: TErrors; // Error data (form validation errors, reason, etc.);
  message?: string; // Message for devs/users
};

type Action = "DELETE_TOKEN"; // Actions, may expand with a union | in the future

// System / Middleware error (e.g., 401 Unauthorized, 403 Forbidden, 500 Server Error)

export type ApiSystemError = {
  success: false;
  errorType: "SYSTEM";
  statusCode: number; // 401, 403, 500
  message: string;
  actions?: Action[];
};

// Discriminated error type

type ApiError<TErrors = undefined> = ApiBusinessError<TErrors> | ApiSystemError;

// Global discriminated union wrapper for any API endpoint

export type ApiResponse<TData = undefined, TErrors = undefined> =
  | ApiSuccess<TData>
  | ApiError<TErrors>;
