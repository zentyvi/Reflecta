import type { RequestHandler } from "express";
import type {
  AuthResponseBody,
  GithybLoginRequestBody,
  GoogleLoginRequestBody,
  LoginRequestBody,
  OAuthResponseBody,
  SignUpRequestBody,
} from "@shared/api/auth.d.ts";

// Auth handlers

export type SignUpHandler = RequestHandler<{}, AuthResponseBody>;
export type LoginHandler = RequestHandler<{}, AuthResponseBody>;

export type GoogleLoginHanlder = RequestHandler<{}, OAuthResponseBody>;

export type GithubLoginHandler = RequestHandler<{}, OAuthResponseBody>;
