import { describe, it, expect, vi, beforeEach } from "vitest";
import auth from "../auth.ts";
import httpClient from "../../inner/httpClient.ts";

// Mock the httpClient default export to intercept network calls
vi.mock("../../inner/httpClient.ts", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Auth Module", () => {
  // Clear all mock call history before each test to maintain isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send a login request with correct payload and options", async () => {
    const loginData = { username: "fake username", password: "password123" };
    const mockResponse = { token: "auth-jwt-token" };

    // Setup mock resolution for httpClient.post
    vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

    const result = await auth.login(loginData);

    // Verify that httpClient.post was called with the correct endpoint, body, and ignore400 flag
    expect(httpClient.post).toHaveBeenCalledWith("/auth/login", {
      ignore400: true,
      body: loginData,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should send a sign-up request with correct payload and options", async () => {
    const signUpData = {
      username: "fake username",
      password: "password123",
      password_confirmation: "password123",
    };
    const mockResponse = { token: "new-user-token" };

    vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

    const result = await auth.signUp(signUpData);

    expect(httpClient.post).toHaveBeenCalledWith("/auth/sign-up", {
      ignore400: true,
      body: signUpData,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should send a Google login request with the provided token", async () => {
    const googleToken = "google-oauth-token-xyz";
    const mockResponse = { token: "server-jwt-token" };

    vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

    const result = await auth.googleLogin(googleToken);

    expect(httpClient.post).toHaveBeenCalledWith("/auth/google", {
      ignore400: true,
      body: { googleToken },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should send a GitHub login request with the provided code", async () => {
    const githubCode = "github-oauth-code-abc";
    const mockResponse = { token: "server-jwt-token" };

    vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

    const result = await auth.githubLogin(githubCode);

    expect(httpClient.post).toHaveBeenCalledWith("/auth/github", {
      ignore400: true,
      body: { code: githubCode },
    });
    expect(result).toEqual(mockResponse);
  });
});
