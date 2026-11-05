import type { authResponse } from "../../@types/api/auth";
import { apiUrl } from "../apiClient.ts";

const authUrl = `${apiUrl}/auth`;

type signUpData = {
  username: string;
  password: string;
  password_confirmation: string;
};

async function signUp(data: signUpData) {
  const response = await fetch(`${authUrl}/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error(
      `Failed to create an account - [status code: ${response.status}]`,
    );
  }

  const result: authResponse = await response.json();
  return result;
}

type loginData = {
  username: string;
  password: string;
};

async function login(data: loginData) {
  const response = await fetch(`${authUrl}/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error(
      `Failed to login into an account - [status code: ${response.status}]`,
    );
  }

  const result: authResponse = await response.json();
  return result;
}

async function googleLogin(googleToken: string) {
  const response = await fetch(`${authUrl}/google`, {
    method: "POST",
    body: JSON.stringify({ token: googleToken }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to login via Google - [status code: ${response.status}]`,
    );
  }

  const result: authResponse = await response.json();
  return result;
}

async function githubLogin(githubCode: string) {
  const response = await fetch(`${authUrl}/github`, {
    method: "POST",
    body: JSON.stringify({ code: githubCode }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to login via Github - [status code: ${response.status}]`,
    );
  }

  const result: authResponse = await response.json();
  return result;
}

const auth = {
  signUp,
  login,
  googleLogin,
  githubLogin,
};

export default auth;
