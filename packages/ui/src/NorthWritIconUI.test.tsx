import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NorthWritIcon } from "./NorthWritIconUI";

function firstBladeFill(container: HTMLElement) {
    const gradient = container.querySelector(
        'linearGradient[id$="-m-glassFill"]',
    );
    const stop = gradient?.querySelector("stop");
    return (stop as SVGStopElement | null)?.style.stopColor.replace(/\s/g, "");
}

afterEach(() => {
    document.documentElement.classList.remove("dark");
});

describe("NorthWritIcon", () => {
    it("renders the dark mark on the light theme", () => {
        const { container } = render(<NorthWritIcon />);

        expect(firstBladeFill(container)).toBe("rgb(31,58,95)");
    });

    it("renders the white mark when the document is in dark mode", () => {
        document.documentElement.classList.add("dark");
        const { container } = render(<NorthWritIcon />);

        expect(firstBladeFill(container)).toBe("rgb(255,255,255)");
    });

    it("swaps palettes when the theme class changes while mounted", async () => {
        const { container } = render(<NorthWritIcon />);
        expect(firstBladeFill(container)).toBe("rgb(31,58,95)");

        document.documentElement.classList.add("dark");

        await waitFor(() =>
            expect(firstBladeFill(container)).toBe("rgb(255,255,255)"),
        );
    });

    it("colours a tinted mark in both themes, under the status palettes", () => {
        const { container, rerender } = render(<NorthWritIcon tint="violet" />);
        expect(firstBladeFill(container)).toBe("rgb(139,92,246)");

        document.documentElement.classList.add("dark");
        rerender(<NorthWritIcon tint="violet" />);
        expect(firstBladeFill(container)).toBe("rgb(139,92,246)");

        rerender(<NorthWritIcon tint="violet" error />);
        expect(firstBladeFill(container)).toBe("rgb(248,113,113)");
    });

    it("keeps the status palettes in dark mode", () => {
        document.documentElement.classList.add("dark");
        const { container } = render(<NorthWritIcon done />);

        expect(firstBladeFill(container)).toBe("rgb(74,222,128)");
    });
});
