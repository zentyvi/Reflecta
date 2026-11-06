import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GithubLoginButton from "../GithubLogInButton.tsx";

describe("Github OAuth button", () => {
  beforeEach(() => {
    // Mock window.location.href safely
    vi.stubGlobal("location", {
      ...window.location,
      href: "",
      origin: "http://localhost:3000",
    });

    // Mock env variables if they aren't loaded in your test environment
    vi.stubEnv("VITE_GITHUB_CLIENT_ID", "test-client-id");
  });

  it("renders button correctly", () => {
    const { container } = render(<GithubLoginButton />);
    const button = screen.getByRole("button", { name: /Login via GitHub/i });
    const logo = screen.getByRole("img", { name: /Github logo/i });
    const text = screen.getByText(/Github/i);
    expect(container).toMatchSnapshot();
    expect(button).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("redirects the user to the correct GitHub OAuth URL when clicked", async () => {
    const user = userEvent.setup();
    render(<GithubLoginButton />);

    const loginButton = screen.getByRole("button", {
      name: /login via github/i,
    });
    await user.click(loginButton);

    // Assert: Verify that window.location.href was updated with the expected URL
    expect(window.location.href).match(/^https:\/\/github.com/);
  });

  it("accepts a 'className' prop properly", () => {
    render(<GithubLoginButton className="test-class" />);

    const loginButton = screen.getByRole("button", {
      name: /login via github/i,
    });
    expect(loginButton.className).includes("test-class");
  });

  it("accepts a 'disabled' prop properly", () => {
    render(<GithubLoginButton disabled={true} />);

    const loginButton = screen.getByRole<HTMLButtonElement>("button", {
      name: /login via github/i,
    });
    expect(loginButton.disabled).toBeTruthy();
  });
});
