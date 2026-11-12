import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import MainSidebar from "../MainSidebar.tsx";
import useLayout from "../../../contexts/LayoutProvider.tsx";
import { useLocation } from "react-router";

vi.mock("../../../contexts/LayoutProvider.tsx");

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useLocation: vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("MainSidebar component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sidebar correctly and handles toggle click", () => {
    const setIsSidebarOpenMock = vi.fn();

    vi.mocked(useLayout).mockReturnValue({sidebar: {
      isSidebarOpen: true,
      setIsSidebarOpen: setIsSidebarOpenMock,
    }} as any);

    vi.mocked(useLocation).mockReturnValue({
      pathname: "/",
    } as any);

    render(<MainSidebar />);

    const toggleButton = screen.getByRole("button", {
      name: /toggle sidebar/i,
    });
    fireEvent.click(toggleButton);

    expect(setIsSidebarOpenMock).toHaveBeenCalled();
  });
});
