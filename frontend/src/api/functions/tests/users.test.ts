import { describe, it, expect, vi, beforeEach } from "vitest";
import users from "../users.ts";
import httpClient from "../../inner/httpClient.ts";

// Mock the httpClient default export to intercept network calls
vi.mock("../../inner/httpClient.ts");

describe("Users module", () => {
  // Clear all mock call history before each test to maintain isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Get my profile", () => {
    it("should send a get request with a 'authenticationRequired' flag", async () => {
      const mockResponse = { id: "fake id", username: "fake username" };

      // Setup mock resolution for httpClient.get
      vi.mocked(httpClient.get).mockResolvedValueOnce(mockResponse as any);

      const result = await users.getMyProfile();

      // Verify that httpClient.get was called with the correct endpoint, and flags
      expect(httpClient.get).toHaveBeenCalledWith("/users/me/profile", {
        authenticationRequired: true,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
