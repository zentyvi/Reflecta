import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RegisterForm from "../RegisterForm.tsx";

describe("Register form", () => {
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
});
