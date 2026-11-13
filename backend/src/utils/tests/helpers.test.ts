import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import { createJWT, generateDefaultUsername, getFromEnv } from "../helpers.ts";
import { afterEach } from "node:test";

describe("Helpers testing module", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("generateDefaultUsername function", () => {
    expect(generateDefaultUsername()).toBeTypeOf("string");
  });

  it("getFromEnv function", () => {
    vi.stubEnv("TEST", "value");
    const value = getFromEnv("TEST");
    expect(value).toMatch(/value/i);

    expect(() => getFromEnv("TEST!")).toThrow();
  });

  it("createJWT function", () => {
    vi.spyOn(jwt, "sign");
    vi.stubEnv("SECRET", "123");
    const fakeUserData = {
      id: "123",
      username: "user",
      userType: "USERNAME",
      passwordVersion: 1,
    };

    const token = createJWT(
      {
        id: "123",
        username: "user",
        userType: "USERNAME",
        passwordVersion: 1,
      },
      "1d",
    );

    expect(token).toBeTypeOf("string");
    expect(jwt.sign).toHaveBeenCalledWith(fakeUserData, "123", {
      expiresIn: "1d",
    });
  });
});
