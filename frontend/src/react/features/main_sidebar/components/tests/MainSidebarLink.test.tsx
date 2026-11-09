import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SidebarLink } from "../../../../config/sidebar_links.tsx";
import MainSidebarLink from "../MainSidebarLink.tsx";

// Mock Link from react-router
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const linkProps: SidebarLink = {
  title: "test link",
  path: "/path",
  icon: <p data-testid="icon" />,
  activeStateIcon: <p data-testid="active-icon" />,
};

describe("MainSidebarLink component", () => {
  it("renders link correctly", () => {
    render(
      <MainSidebarLink
        isActive={false}
        title={linkProps.title}
        path={linkProps.path}
        icon={linkProps.icon}
        activeStateIcon={linkProps.activeStateIcon}
      />,
    );
    const link = screen.getByRole("link", { name: /test link/i });
    const unactiveIcon = screen.getByTestId("icon");
    expect(link).toBeInTheDocument();
    expect(unactiveIcon).toBeInTheDocument();
  });

  it("renders activeIcon if the 'isActive' prop is true", () => {
    render(
      <MainSidebarLink
        isActive={true}
        title={linkProps.title}
        path={linkProps.path}
        icon={linkProps.icon}
        activeStateIcon={linkProps.activeStateIcon}
      />,
    );
    const link = screen.getByRole("link", { name: /test link/i });
    const activeIcon = screen.getByTestId("active-icon");
    expect(link).toBeInTheDocument();
    expect(activeIcon).toBeInTheDocument();
  });
});
