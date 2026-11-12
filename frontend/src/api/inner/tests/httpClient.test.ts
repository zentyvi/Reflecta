import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import httpClient from "../httpClient.ts";
import { apiUrl } from "../config.ts";

// Mock sensitive configuration values while preserving the original apiUrl
vi.mock("../../config.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../config.ts")>();
  return {
    ...actual,
    token: "mock-token-123",
    bearer: "Bearer mock-token-123",
  };
});

describe("HttpClient", () => {
  // Stub global fetch before each test to isolate network behavior
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  // Clean up global mocks to prevent test pollution
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should perform a successful GET request and return parsed JSON", async () => {
    const mockResponseData = { success: true, data: "test" };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponseData,
    } as Response);

    const result = await httpClient.get<never, typeof mockResponseData>(
      "/users",
    );

    // Ensure proper endpoint assembly and method configuration
    expect(fetch).toHaveBeenCalledWith(
      `${apiUrl}/users`,
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual(mockResponseData);
  });

  it("should automatically serialize JSON bodies and set the Content-Type header", async () => {
    const requestBody = { name: "John Doe" };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, ...requestBody }),
    } as Response);

    await httpClient.post("/users", { body: requestBody });

    // Verify payload serialization and required JSON headers
    expect(fetch).toHaveBeenCalledWith(
      `${apiUrl}/users`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: expect.objectContaining({
          "Content-type": "application/json",
        }),
      }),
    );
  });

  it("should preserve FormData instances and omit manual Content-Type headers for multipart requests", async () => {
    const formData = new FormData();
    formData.append("file", "mock-file-content");

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ uploaded: true }),
    } as Response);

    await httpClient.post("/upload", { body: formData });

    expect(fetch).toHaveBeenCalledWith(
      `${apiUrl}/upload`,
      expect.objectContaining({ body: formData }),
    );

    // Content-Type must be undefined so the runtime/browser can append the multipart boundary automatically
    const callArgs = vi.mocked(fetch).mock.calls[0][1];
    const headers = callArgs?.headers as Record<string, string>;
    expect(headers["Content-type"]).toBeUndefined();
  });

  it("should reject and throw an error when the response status indicates failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    } as Response);

    // Expect the promise to catch server-side failures correctly
    await expect(httpClient.get("/fail")).rejects.toThrow("HTTP Error: 500");
  });

  it("should bypass error throwing on HTTP 400 if ignore400 option is enabled", async () => {
    const errorResponseData = { field: "email", message: "Invalid email" };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponseData,
    } as Response);

    // Useful for form validation flows where validation errors (400) need to be read by the UI components
    const result = await httpClient.post("/submit", {
      body: { email: "bad-email" },
      ignore400: true,
    });

    expect(result).toEqual(errorResponseData);
  });
});
