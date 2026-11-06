import type {
  AuthResponseBody,
  LoginRequestBody,
  SignUpRequestBody,
} from "../../../../types/api/auth.d.ts";
import { apiUrl } from "../apiClient.ts";

const authUrl = `${apiUrl}/auth`;

async function signUp(data: SignUpRequestBody) {
  const response = await fetch(`${authUrl}/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error(
      `Failed to create an account - [status code: ${response.status}]`,
    );
  }

  const result: AuthResponseBody = await response.json();
  return result;
}

async function login(data: LoginRequestBody) {
  const response = await fetch(`${authUrl}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error(
      `Failed to login into an account - [status code: ${response.status}]`,
    );
  }

  const result: AuthResponseBody = await response.json();
  return result;
}

async function googleLogin(googleToken: string) {
  const response = await fetch(`${authUrl}/google`, {
    method: "POST",
    body: JSON.stringify({ googleToken }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to login via Google - [status code: ${response.status}]`,
    );
  }

  const result: AuthResponseBody = await response.json();
  return result;
}

async function githubLogin(code: string) {
  const response = await fetch(`${authUrl}/github`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to login via Github - [status code: ${response.status}]`,
    );
  }

  const result: AuthResponseBody = await response.json();
  return result;
}

const auth = {
  signUp,
  login,
  googleLogin,
  githubLogin,
};

export default auth;
