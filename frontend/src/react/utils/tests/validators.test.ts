import { describe, expect, it, vi } from "vitest";
import type { ErrorsObject } from "../../../@types/ErrorObjects.d.ts";
import { validatePassword, validateUsername } from "../validators.ts";

// Helper to simulate a React ChangeEvent
const createMockEvent = (value: string) => {
  return {
    target: { value },
  } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
};

// Helper to simulate React's setErrors state update callback and return the new state
const runValidator = (
  validator: Function,
  value: string,
  initialState: ErrorsObject = {},
  field?: string,
): ErrorsObject => {
  let updatedState = { ...initialState };

  // Mock setErrors behavior when it receives a function: (prev) => { ... }
  const mockSetErrors = vi.fn((callback) => {
    if (typeof callback === "function") {
      updatedState = callback(updatedState);
    }
  });

  const event = createMockEvent(value);
  validator(event, mockSetErrors, field);

  return updatedState;
};

describe("validateUsername", () => {
  it("clears error on an empty string", () => {
    const state = runValidator(validateUsername, "");
    expect(state.username).toBeNull();
  });

  it("clears error on a valid username", () => {
    const state = runValidator(validateUsername, "validUser123");
    expect(state.username).toBeNull();
  });

  it("sets character restriction message if too short", () => {
    const state = runValidator(validateUsername, "ab");
    expect(state.username?.msg).toBe(
      "Username must be between 3 and 30 characters",
    );
  });

  it("sets character restriction message if too long", () => {
    const state = runValidator(validateUsername, "a".repeat(31));
    expect(state.username?.msg).toBe(
      "Username must be between 3 and 30 characters",
    );
  });

  it("sets invalid characters message for spaces or unsupported symbols", () => {
    const state = runValidator(validateUsername, "user name!");
    expect(state.username?.msg).toBe(
      "Username can only contain letters, numbers, underscores and hyphens",
    );
  });

  it("supports custom field keys", () => {
    const state = runValidator(validateUsername, "ab", {}, "customUserField");
    expect(state.customUserField?.msg).toBe(
      "Username must be between 3 and 30 characters",
    );
  });
});

describe("validatePassword", () => {
  it("clears error on an empty string", () => {
    const state = runValidator(validatePassword, "");
    expect(state.password).toBeNull();
  });

  it("clears error on a valid strong password", () => {
    const state = runValidator(validatePassword, "Secret_Pass123!");
    expect(state.password).toBeNull();
  });

  it("sets length restriction message if under 6 characters", () => {
    const state = runValidator(validatePassword, "12345");
    expect(state.password?.msg).toBe(
      "Password must contain at least 6 characters",
    );
  });

  it("sets invalid character message if it contains a space", () => {
    const state = runValidator(validatePassword, "pass word123");
    expect(state.password?.msg).toBe(
      "Password can contain only letters, numbers and symbols without spaces",
    );
  });

  it("supports custom field keys", () => {
    const state = runValidator(
      validatePassword,
      "123",
      {},
      "customPasswordField",
    );
    expect(state.customPasswordField?.msg).toBe(
      "Password must contain at least 6 characters",
    );
  });
});
