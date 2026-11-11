// @ts-ignore
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "../../prisma/db.ts";
import protectRoute from "../../middlewares/auth/protectRoute.middleware.ts";
import app from "../testing_app.ts";

// Mock middleware
vi.mock("../../middlewares/auth/protectRoute.middleware.ts");

describe("Users Controller integrated tests", async () => {
  const createdUser = await db.orm.users.create({
    username: "testuser1" + Date.now(),
    userType: "USERNAME",
  });
  afterAll(async () => {
    await db.orm.users.where({ id: createdUser.id }).delete();
  });

  describe("GET /api/v1/users/me/profile", () => {
    it("returns a user's profile found by id from jwt", async () => {
      // Mock protection middleware
      vi.mocked(protectRoute).mockImplementation((req, res, next) => {
        // Fake jwt payload
        req.user = {
          id: createdUser.id,
        } as any;
        next();
      });

      const response = await request(app).get("/api/v1/users/me/profile");
      const expectedUserObject = {
        id: createdUser.id,
        username: createdUser.username,
        displayName: createdUser.displayName,
        userType: createdUser.userType,
        createdAt: createdUser.createdAt.toISOString(),
        updatedAt: createdUser.updatedAt.toISOString(),
      };

      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.user).toEqual(expectedUserObject);
    });

    it("return 404 not found, if an id is incorrect", async () => {
      vi.mocked(protectRoute).mockImplementation((req, res, next) => {
        req.user = {
          id: "6af46486416e84607a7895d7", // Fake ObjectId
        } as any;
        next();
      });

      const response = await request(app).get("/api/v1/users/me/profile");

      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body).toHaveProperty("message");
    });
  });
});
