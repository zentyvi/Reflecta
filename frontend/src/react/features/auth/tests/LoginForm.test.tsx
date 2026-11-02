import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LoginForm from "../LoginForm.tsx";

describe("Login form", () => {
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
});
