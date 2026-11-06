import type { RequestHandler } from "express";
import type {
  AuthResponseBody,
  GithybLoginRequestBody,
  GoogleLoginRequestBody,
  LoginRequestBody,
  OAuthResponseBody,
  SignUpRequestBody,
} from "../../../types/api/auth.d.ts";

// Auth handlers

export type SignUpHandler = RequestHandler<
  {},
  AuthResponseBody,
  SignUpRequestBody
>;
export type LoginHandler = RequestHandler<
  {},
  AuthResponseBody,
  LoginRequestBody
>;

export type GoogleLoginHanlder = RequestHandler<
  {},
  OAuthResponseBody,
  GoogleLoginRequestBody
>;

export type GithubLoginHandler = RequestHandler<
  {},
  OAuthResponseBody,
  GithybLoginRequestBody
>;
