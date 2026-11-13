import { describe, expect, it } from "vitest";
import {
  makeBusinessErrorResponse,
  makeSuccessResponse,
  makeSystemErrorResponse,
} from "../makeResponse.js";

describe("MakeResponse functions", () => {
  it("makeSuccessResponse function", () => {
    const response = makeSuccessResponse<string>("hello!");
    expect(response.success).toBeTruthy();
    expect(response.data).toMatch(/hello!/i);
  });

  it("makeBusinessErrorResponse function", () => {
    const response = makeBusinessErrorResponse<string>({
      errorData: "error :(",
      message: "failed",
    });
    expect(response.success).toBeFalsy();
    expect(response.errorType).toBe("BUSINESS");
    expect(response.errorData).toMatch(/error :\(/i);
    expect(response.message).toMatch(/failed/i);
  });

  it("makeSystemErrorResponse function", () => {
    const response = makeSystemErrorResponse({
      statusCode: 404,
      message: "message",
      actions: ["DELETE_TOKEN"],
    });
    expect(response.success).toBeFalsy();
    expect(response.errorType).toBe("SYSTEM");
    expect(response.statusCode).toBe(404);
    expect(response.message).toMatch(/message/i);
    expect(response.actions).toEqual(["DELETE_TOKEN"]);
  });
});
