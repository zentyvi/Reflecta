import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import AuthPage from "../AuthPage.tsx";

describe("AuthPage Component (React Router v7)", () => {
  it('renders the login variant when path includes "login"', () => {
    // 1. Create a memory router instance with configuration objects
    const router = createMemoryRouter(
      [
        {
          path: "/auth/login",
          element: <AuthPage />,
        },
      ],
      {
        initialEntries: ["/auth/login"], // Set the starting URL path
      },
    );

    // 2. Render using the RouterProvider
    render(<RouterProvider router={router} />);

    // 3. Assertions
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /login/i,
    );
    expect(screen.getByText(/sign in your account, or/i)).toBeInTheDocument();

    const toggleLink = screen.getByRole("link", { name: /register/i });
    expect(toggleLink).toHaveAttribute("href", "/auth/register");
  });

  it('renders the register variant when path does not include "login"', () => {
    const router = createMemoryRouter(
      [
        {
          path: "/auth/register",
          element: <AuthPage />,
        },
      ],
      {
        initialEntries: ["/auth/register"],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /register/i,
    );
    expect(screen.getByText(/create an account, or/i)).toBeInTheDocument();
  });

  it("renders layout components inside the <Outlet /> structural placeholder", () => {
    // To test what renders inside <Outlet />, nest the children inside the route config
    const router = createMemoryRouter(
      [
        {
          path: "/auth",
          element: <AuthPage />,
          children: [
            {
              path: "login",
              element: <div data-testid="nested-form">Mocked Login Form</div>,
            },
          ],
        },
      ],
      {
        initialEntries: ["/auth/login"],
      },
    );

    render(<RouterProvider router={router} />);

    // Assert that the child route content successfully renders where the <Outlet /> is placed
    expect(screen.getByTestId("nested-form")).toBeInTheDocument();
  });
});
