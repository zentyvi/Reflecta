import { useGoogleLogin } from "@react-oauth/google";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GoogleLoginButton from "../GoogleLogInButton.tsx";

vi.mock("@react-oauth/google");

describe("Google OAuth button", () => {
  // Mock Google's OAuth react hook
  vi.mocked(useGoogleLogin).mockImplementation(() => vi.fn());

  it("renders button correctly", () => {
    const { container } = render(<GoogleLoginButton />);
    const button = screen.getByRole("button", { name: /Login via Google/i });
    const logo = screen.getByRole("img", { name: /Google logo/i });
    const text = screen.getByText("Google");
    expect(container).toMatchSnapshot();
    expect(button).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("calls the function when pressed", async () => {
    const user = userEvent.setup();
    render(<GoogleLoginButton />);
    const button = screen.getByRole("button", {
      name: /Login via Google/i,
    });
    await user.click(button);
    expect(useGoogleLogin).toHaveBeenCalled();
  });

  it("accepts a 'className' prop properly", () => {
    render(<GoogleLoginButton className="test-class" />);
    const button = screen.getByRole("button", {
      name: /Login via Google/i,
    });
    expect(button.className).include("test-class");
  });
});
