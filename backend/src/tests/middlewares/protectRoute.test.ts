import { describe, expect, it, vi } from "vitest";
import protectRoute from "../../middlewares/auth/protectRoute.middleware.ts";

describe("Protect route middleware", () => {
  it("should return 403 Forbidden when req.user is null", () => {
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
    expect(res.status).toHaveBeenCalledWith(403); // Check if status 403 was set
    expect(jsonMock).toHaveBeenCalled(); // Check if response was sent with json
    expect(next).not.toHaveBeenCalled(); // Ensure next() was NOT called (access denied)
  });

  it("allows request when user isn't null and calls next()", () => {
    const res: any = {};
    const req: any = { user: {} };
    const next = vi.fn();

    protectRoute(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
