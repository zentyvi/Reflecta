import { describe, expect, it, vi } from "vitest";
import protectRoute from "../../../middlewares/auth/protectRoute.middleware.ts";

describe("Protect route middleware", () => {
  it("should pass an error to next() when req.user is null", () => {
    // 1. Create a mock function for res.json()
    const jsonMock = vi.fn();

    // 2. Mock res object with method chaining support (.status().json())
    const res: any = {
      status: vi.fn().mockImplementation((code) => {
        // res.status() returns an object containing .json() so chaining works
        return { json: jsonMock };
      }),
    };

    const req: any = { user: null };
    const next = vi.fn(); // Mock for next() middleware

    // 3. Run the middleware
    protectRoute(req, res, next);

    // 4. Assertions
    expect(next).toHaveBeenCalledWith({
      message: "Invalid or expired token",
      statusCode: 403,
      actions: ["DELETE_TOKEN"],
    });
  });

  it("allows request when user isn't null and calls next()", () => {
    const res: any = {};
    const req: any = { user: {} };
    const next = vi.fn();

    protectRoute(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
