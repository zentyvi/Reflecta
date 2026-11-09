import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEscape, useTitle } from "../hooks.tsx";

describe("Custom react hooks", () => {
  describe("useEscape hook", () => {
    it("should call the callback when Escape key is pressed", () => {
      const callback = vi.fn();
      renderHook(() => useEscape(callback));
      // Mock escape button press
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should NOT call the callback when another key is pressed", () => {
      const callback = vi.fn();
      renderHook(() => useEscape(callback));
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      window.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should remove event listener when component unmounts", () => {
      const callback = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const { unmount } = renderHook(() => useEscape(callback));
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("useTitle hook", () => {
    it("sets document's title", () => {
      renderHook(() => useTitle("test"));
      const parts = document.title.split(" ");
      expect(parts[0]).toBe("test");
      expect(parts[1]).toBe("|");
      expect(parts[2]).toBeTypeOf("string")
    });
  });
});
