import { useGoogleLogin } from "@react-oauth/google";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import useAuth from "../../../contexts/AuthProvider.tsx";
import RegisterForm from "../RegisterForm.tsx";

vi.mock("@react-oauth/google");
vi.mock("../../../contexts/AuthProvider.tsx");

describe("Register form", () => {
  vi.mocked(useAuth).mockImplementation(() => ({ login: vi.fn() }) as any);
  vi.mocked(useGoogleLogin).mockImplementation(() => vi.fn());

  it("renders form", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );
    const form = screen.getByRole("form", { name: /register form/i });
    const submitButton = screen.getByTestId("submit-button");
    expect(form).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("renders 2 OAuth buttons", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );
    const googleButton = screen.getByRole("button", {
      name: /Login via Google/i,
    });
    const githubButton = screen.getByRole("button", {
      name: /Login via Github/i,
    });
    expect(googleButton).toBeInTheDocument();
    expect(githubButton).toBeInTheDocument();
  });
});
