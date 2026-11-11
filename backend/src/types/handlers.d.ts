import type {
  AuthResponseBody,
  OAuthResponseBody,
} from "@shared/api/auth.d.ts";
import type { MyProfileResponseBody } from "@shared/api/users.d.ts";
import type { RequestHandler } from "express";
import type { ProtectedHandler } from "./express";

// Auth handlers

export type SignUpHandler = RequestHandler<{}, AuthResponseBody>;
export type LoginHandler = RequestHandler<{}, AuthResponseBody>;
export type GoogleLoginHanlder = RequestHandler<{}, OAuthResponseBody>;
export type GithubLoginHandler = RequestHandler<{}, OAuthResponseBody>;

// Users handlers

export type GetMyProfileHanlder = ProtectedHandler<{}, MyProfileResponseBody>;
