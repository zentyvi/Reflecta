import type { ErrorsObject } from "../ErrorObjects.d.ts";

export {};

type AuthErrorsBody = {
  success: false;
  errors: ErrorsObject;
};

type AuthSuccessBody = {
  success: true;
  token: string;
};

export type AuthResponseBody = AuthErrorsBody | AuthSuccessBody;

type OAuthErrorsBody = {
  success: false;
  message: string;
};

type OAuthSuccessBody = {
  success: true;
  token: string;
};

export type OAuthResponseBody = OAuthErrorsBody | OAuthSuccessBody;

export type SignUpRequestBody = {
  username: string;
  password: string;
  password_confirmation: string;
};

export type LoginRequestBody = {
  username: string;
  password: string;
};

export type GoogleLoginRequestBody = {
  googleToken: string;
};

export type GithybLoginRequestBody = {
  code: string;
};
