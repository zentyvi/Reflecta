import { useGoogleLogin } from "@react-oauth/google";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import useAuth from "../../../contexts/AuthProvider.tsx";
import LoginForm from "../LoginForm.tsx";

vi.mock("@react-oauth/google");
vi.mock("../../../contexts/AuthProvider.tsx");

describe("Login form", () => {
  vi.mocked(useAuth).mockImplementation(() => ({ login: vi.fn() }) as any);
  vi.mocked(useGoogleLogin).mockImplementation(() => vi.fn());

  it("renders form", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );
    const form = screen.getByRole("form", { name: /login form/i });
    const submitButton = screen.getByTestId("submit-button");
    expect(form).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("renders 2 OAuth buttons", () => {
    render(
      <MemoryRouter>
        <LoginForm />
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
