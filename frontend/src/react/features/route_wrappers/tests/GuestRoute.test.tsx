import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import useAuth from "../../../contexts/AuthProvider.tsx";
import GuestRoute from "../GuestRoute.tsx";

vi.mock("../../../contexts/AuthProvider.tsx");

const router = createMemoryRouter(
  [
    {
      path: "/auth",
      element: <GuestRoute />,
      children: [
        {
          path: "/auth/login",
          element: <h1>login</h1>,
        },
      ],
    },
    {
      path: "/",
      element: <h1>home</h1>,
    },
  ],
  { initialEntries: ["/auth/login"] },
);

describe("Guest route wrapper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes a user thorugh if isn't authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: /login/i });
    expect(heading).toBeInTheDocument();
  });

  it("navigates a user to '/' if is authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: /home/i });
    expect(heading).toBeInTheDocument();
  });
});
