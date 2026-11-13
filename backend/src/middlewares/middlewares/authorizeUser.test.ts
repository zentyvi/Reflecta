// @ts-ignore
import { describe, expect, it, vi } from "vitest";
import authorizeUser from "../../middlewares/auth/authorizeUser.middleware.ts";

vi.mock("jsonwebtoken", () => {
  return {
    default: {
      verify: vi.fn().mockReturnValue({ username: "zenty" }),
      sign: vi.fn().mockReturnValue("fake-jwt-token"),
    },
  };
});

describe("AuthorizeUser middleware", () => {
  it("should decode a token if provided", async () => {
    const req: any = {
      headers: {
        authorization: "Bearer fake_jwt",
      },
    };
    const res: any = {};
    const next = vi.fn();

    authorizeUser(req, res, next);

    expect(req).toHaveProperty("user");
    expect(req.user).toEqual({ username: "zenty" });
    expect(next).toHaveBeenCalledOnce();
  });

  it("sets user = null if a token wasn't provided", () => {
    const req: any = {
      headers: {},
    };
    const res: any = {};
    const next = vi.fn();

    authorizeUser(req, res, next);

    expect(req.user).toBeNull();
  });
});
