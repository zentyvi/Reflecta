import type {
  AuthResponseBody,
  LoginRequestBody,
  SignUpRequestBody,
} from "@shared/api/auth.d.ts";
import httpClient from "../inner/httpClient.ts";

async function signUp(data: SignUpRequestBody) {
  try {
    const result = await httpClient.post<SignUpRequestBody, AuthResponseBody>(
      "/auth/sign-up",
      {
        ignore400: true,
        body: data,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(`[Failed to sign up] ${message}`);
  }
}

async function login(data: LoginRequestBody) {
  try {
    const result = await httpClient.post<LoginRequestBody, AuthResponseBody>(
      "/auth/login",
      {
        ignore400: true,
        body: data,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(`[Failed to login] ${message}`);
  }
}

async function googleLogin(googleToken: string) {
  try {
    const result = await httpClient.post<string, AuthResponseBody>(
      "/auth/google",
      {
        ignore400: true,
        body: googleToken,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(`[Failed to login via Google] ${message}`);
  }
}

async function githubLogin(code: string) {
  try {
    const result = await httpClient.post<string, AuthResponseBody>(
      "/auth/github",
      {
        ignore400: true,
        body: code,
      },
    );
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error(`[Failed to login via Github] ${message}`);
  }
}

const auth = {
  signUp,
  login,
  googleLogin,
  githubLogin,
};

export default auth;
