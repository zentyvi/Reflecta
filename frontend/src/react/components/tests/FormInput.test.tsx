import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../FormInput.tsx";

describe("Custom input component", () => {
  describe("Core tests", () => {
    it("renders input", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label="input"
        />,
      );
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders label and pairs it with the input by id", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label="label"
        />,
      );
      const input = screen.getByRole("textbox");
      const label = screen.getByText<HTMLLabelElement>("label");
      expect(label).toBeInTheDocument();
      expect(input.id).toBe(label.htmlFor);
    });

    it("accepts a React node as a label", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label={<span data-testid="provided-span">123</span>}
        />,
      );
      const providedSpan = screen.getByTestId("provided-span");
      expect(providedSpan).toBeInTheDocument();
    });

    it("calls the provided onChange callback", async () => {
      const cb = vi.fn();
      render(<FormInput value={""} onChange={cb} name="input" label="label" />);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "text");
      expect(cb).toHaveBeenCalled();
    });

    it("doesn't call the onChange callback, if disabled", async () => {
      const cb = vi.fn();
      render(
        <FormInput
          value={""}
          onChange={cb}
          name="input"
          label="label"
          disabled
        />,
      );
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "text");
      expect(cb).not.toHaveBeenCalled();
    });

    it("displays error when provided", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          error="error"
        />,
      );
      const error = screen.getByText("error");
      expect(error).toBeInTheDocument();
    });

    it("displays an asterisk when the input is required", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          required
        />,
      );
      const input = screen.getByRole<HTMLInputElement>("textbox");
      const label = screen.getByText<HTMLLabelElement>("label");
      expect(input.required).toBeTruthy();
      expect(label.textContent).toMatch(/\*$/);
    });

    it("displays a placeholder if provided", () => {
      render(
        <FormInput
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          placeholder="Hello!"
        />,
      );
      const input = screen.getByRole<HTMLInputElement>("textbox");
      expect(input.placeholder).toBe("Hello!");
    });
  });

  describe("Textarea tests", () => {
    it("renders a textarea when type is 'textarea'", () => {
      render(
        <FormInput
          type="textarea"
          value={""}
          onChange={() => null}
          name="input"
          label="label"
        />,
      );
      const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("accepts numbers of cells and rows", () => {
      render(
        <FormInput
          type="textarea"
          cols={100}
          rows={200}
          value={""}
          onChange={() => null}
          name="input"
          label="label"
        />,
      );
      const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");
      expect(textarea.cols).toBe(100);
      expect(textarea.rows).toBe(200);
    });
  });

  describe("Password input tests", () => {
    it("renders an input with a type='password'", () => {
      render(
        <FormInput
          type="password"
          value={""}
          onChange={() => null}
          name="input"
          label="label"
        />,
      );
      const input = screen.getByTestId<HTMLInputElement>("password-input");
      expect(input).toBeInTheDocument();
      expect(input.type).toBe("password");
    });

    it("set the type property to 'text' if the 'showPassword' is true", () => {
      render(
        <FormInput
          type="password"
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          showPassword
        />,
      );
      const input = screen.getByTestId<HTMLInputElement>("password-input");
      expect(input.type).toBe("text");
    });

    it("shows a button to toggle the password's visibility", () => {
      render(
        <FormInput
          type="password"
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          showPassword={true}
          showPasswordToggle
        />,
      );
      const button = screen.getByRole<HTMLButtonElement>("button", {
        name: /Show password/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label");
      expect(button).toHaveAttribute("aria-pressed");
    });

    it("calls the onShowPassword callback when the button is pressed", async () => {
      const cb = vi.fn();
      render(
        <FormInput
          type="password"
          value={""}
          onChange={() => null}
          name="input"
          label="label"
          showPasswordToggle
          onShowPassword={cb}
        />,
      );
      const button = screen.getByRole<HTMLButtonElement>("button");
      await userEvent.click(button);
      expect(cb).toHaveBeenCalled();
    });
  });
});
