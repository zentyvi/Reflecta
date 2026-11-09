import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import useAuth from "../../../contexts/AuthProvider.tsx";
import ProtectedRoute from "../ProtectedRoute.tsx";

vi.mock("../../../contexts/AuthProvider.tsx");

const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <h1>home</h1>,
        },
      ],
    },
    {
      path: "/auth/login",
      element: <h1>login</h1>,
    },
  ],
  { initialEntries: ["/"] },
);

describe("Protected route wrapper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Passes a user thorugh if is authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as any);

    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: /home/i });
    expect(heading).toBeInTheDocument();
  });

  it("Navigates a user to '/auth/login' if isn't authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as any);

    render(<RouterProvider router={router} />);
    const heading = screen.getByRole("heading", { name: /login/i });
    expect(heading).toBeInTheDocument();
  });
});
