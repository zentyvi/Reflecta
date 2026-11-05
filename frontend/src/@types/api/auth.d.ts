import type { ErrorsObject } from "../ErrorObjects";

export {};

type authErrors = {
  success: false;
  errors: ErrorsObject;
};

type authSuccess = {
  success: true;
  token: string;
};

export type authResponse = authErrors | authSuccess;
