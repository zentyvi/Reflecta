import type { AuthResponseBody } from "@shared/api/responses/auth.d.ts";
import type { FormErrorsObject } from "@shared/other/FormValidationErrors.d.ts";

import httpClient from "../inner/httpClient.ts";

type SignUpRequestBody = {
  username: string;
  password: string;
  password_confirmation: string;
};

async function signUp(data: SignUpRequestBody) {
  try {
    const result = await httpClient.post<AuthResponseBody, FormErrorsObject>(
      "/auth/sign-up",
      {
        ignore400: true,
        body: data,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "No message";
    console.error(`[Failed to sign up]: ${message}`);
    throw err;
  }
}

type LoginRequestBody = {
  username: string;
  password: string;
};

async function login(data: LoginRequestBody) {
  try {
    const result = await httpClient.post<AuthResponseBody, FormErrorsObject>(
      "/auth/login",
      {
        ignore400: true,
        body: data,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "No message";
    console.error(`[Failed to login]: ${message}`);
    throw err;
  }
}

async function googleLogin(googleToken: string) {
  try {
    const result = await httpClient.post<AuthResponseBody, string>(
      "/auth/google",
      {
        ignore400: true,
        body: { googleToken },
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "No message";
    console.error(`[Failed to login via Google]: ${message}`);
    throw err;
  }
}

async function githubLogin(code: string) {
  try {
    const result = await httpClient.post<AuthResponseBody, string>(
      "/auth/github",
      {
        ignore400: true,
        body: { code },
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "No message";
    console.error(`[Failed to login via Github]: ${message}`);
    throw err;
  }
}

const auth = {
  signUp,
  login,
  googleLogin,
  githubLogin,
};

export default auth;
