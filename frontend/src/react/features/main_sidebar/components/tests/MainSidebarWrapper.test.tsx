import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MainSidebarWrapper from "../MainSidebarWrapper.tsx";
import useLayout from "../../../../contexts/LayoutProvider.tsx";

vi.mock("../../../../contexts/LayoutProvider.tsx");

describe("MainSidebarWrapper component", () => {
  it("renders children correctly", () => {
    vi.mocked(useLayout).mockReturnValue({
      isSidebarOpen: true,
      setIsSidebarOpen: vi.fn(),
    } as any);

    render(
      <MainSidebarWrapper>
        <div data-testid="child-element">Sidebar Content</div>
      </MainSidebarWrapper>,
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  it("calls setIsSidebarOpen(false) when Escape key is pressed", () => {
    const setIsSidebarOpenMock = vi.fn();

    vi.mocked(useLayout).mockReturnValue({
      isSidebarOpen: true,
      setIsSidebarOpen: setIsSidebarOpenMock,
    } as any);

    render(
      <MainSidebarWrapper>
        <p>Content</p>
      </MainSidebarWrapper>,
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(setIsSidebarOpenMock).toHaveBeenCalledWith(false);
  });
});
