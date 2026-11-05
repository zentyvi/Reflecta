// @ts-ignore
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "../../prisma/db.ts";
import app from "../testing_app.ts";

vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: class {
      verifyIdToken() {
        return Promise.resolve({
          getPayload: () => ({
            sub: "google_123456789", // Simulated Google user ID
            email: "test@gmail.com",
          }),
        });
      }
    },
  };
});

describe("Auth Controller Integration Tests", () => {
  // Test data to be reused across test cases
  const mockUser = {
    username: "testuser" + Date.now(),
    password: "Password123!",
    password_confirmation: "Password123!",
  };

  // Optional: Clean up created test user from the database after running all tests
  afterAll(async () => {
    await db.orm.users.where({ username: mockUser.username }).delete();
  });

  describe("POST /api/v1/auth/sign-up", () => {
    it("should successfully register a new user and return a JWT token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/sign-up")
        .send(mockUser);

      expect(response.status).toBe(201);

      // Verify that response body contains the JWT token
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("should return 400 Bad Request if validation fails (empty payload)", async () => {
      // Send request with empty body to trigger express-validator errors
      const response = await request(app).post("/api/v1/auth/sign-up").send({});

      expect(response.status).toBe(400);

      // Ensure validation error object is returned in response
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should successfully authenticate an existing user and return a JWT token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(mockUser);

      expect(response.status).toBe(200);

      // Ensure token is returned upon successful authentication
      expect(response.body).toHaveProperty("token");
    });

    it("should return 400 Bad Request when password does not match", async () => {
      // Send request with incorrect password
      const response = await request(app).post("/api/v1/auth/login").send({
        username: mockUser.username,
        password: "WrongPassword123!",
      });

      // Verify error response
      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveProperty("password");
    });
  });

  it("should return 400 Bad Request when trying to login with password into account created with OAuth", async () => {
    const mockedGoogleUsername = "test_google" + Date.now();
    await db.orm.users.create({
      username: mockedGoogleUsername,
      userType: "GOOGLE",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      username: mockedGoogleUsername,
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty("password");

    await db.orm.users.where({ username: mockedGoogleUsername }).delete();
  });
});

describe("Google Login Integration Test", () => {
  afterAll(async () => {
    await db.orm.users.where({ googleId: "google_123456789" }).delete();
  });

  it("should successfully log in or register user via Google token and return JWT", async () => {
    // Send request with a fake Google ID token
    const response = await request(app)
      .post("/api/v1/auth/google") // Adjust route path to your app
      .send({ token: "fake_google_id_token" });

    expect(response.status).toBe(200);

    // Ensure JWT token is returned
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 if Google token is missing", async () => {
    // Send request without token property
    const response = await request(app).post("/api/v1/auth/google").send({});

    // Expect bad request error
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GitHub Login Integration Test", () => {
  afterAll(async () => {
    await db.orm.users.where({ githubId: "987654321" }).delete();
  });

  it("should successfully authenticate via GitHub code and return JWT", async () => {
    // Mock global fetch responses for GitHub OAuth flow
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (String(url).includes("access_token")) {
        // Mocking response from GitHub token endpoint
        return Promise.resolve(
          new Response(
            JSON.stringify({ access_token: "fake_gh_access_token" }),
          ),
        );
      }
      if (String(url).includes("api.github.com/user")) {
        // Mocking response from GitHub user profile endpoint
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 987654321,
              login: "github_test_user",
            }),
          ),
        );
      }
      return Promise.reject(new Error("Unknown fetch URL"));
    });

    // Send request with authorization code
    const response = await request(app)
      .post("/api/v1/auth/github")
      .send({ code: "fake_github_code" });

    // Verify response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    // Restore original fetch after test
    fetchSpy.mockRestore();
  });

  it("should return 400 if GitHub authorization code is missing", async () => {
    const response = await request(app).post("/api/v1/auth/github").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
