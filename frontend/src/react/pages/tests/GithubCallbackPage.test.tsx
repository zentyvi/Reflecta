import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSearchParams } from "react-router";
import GithubCallbackPage from "../GithubCallbackPage.tsx";
import useAuth from "../../contexts/AuthProvider.tsx";
import api from "../../../api/index.ts";

vi.mock("../../contexts/AuthProvider.tsx");
vi.mock("../../../api/index.ts");
vi.mock("react-router");

describe("Github callback page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock AuthProvider
    vi.mocked(useAuth).mockReturnValue({ login: vi.fn() } as any);
    // Mock api
    vi.mocked(api.auth.githubLogin).mockImplementation(vi.fn());
  });

  it("renders loading", () => {
    // Returns valid code
    vi.mocked(useSearchParams).mockReturnValue([{ get: () => 123 }] as any);
    render(<GithubCallbackPage />);
    const heading = screen.getByRole("heading", { name: /Authenticating.../i });
    expect(heading).toBeInTheDocument();
    expect(document.title).include("Authenticating...");
  });

  it("renders error if no code was provided", () => {
    // Returns no code
    vi.mocked(useSearchParams).mockReturnValue([{ get: () => null }] as any);
    render(<GithubCallbackPage />);
    const errorHeading = screen.getByRole("heading", {
      name: /Error has occurred/i,
    });
    expect(errorHeading).toBeInTheDocument();
    expect(document.title).include("Authentication Error");
  });

  it("calls api function", () => {
    // Returns valid code
    vi.mocked(useSearchParams).mockReturnValue([{ get: () => 123 }] as any);
    render(<GithubCallbackPage />);
    expect(api.auth.githubLogin).toHaveBeenCalled();
  });
});
