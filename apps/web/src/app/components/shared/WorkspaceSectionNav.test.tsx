import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceSectionNav } from "./WorkspaceSectionNav";
const state = vi.hoisted(() => ({ pathname: "/playbooks/playbook-1" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
describe("grouped workspace sections", () => {
    it("keeps Playbooks discoverable and selected in Library", () => {
        render(<WorkspaceSectionNav />);
        expect(screen.getByRole("navigation", { name: "Library sections" })).toBeVisible();
        expect(screen.getByRole("link", { name: "Playbooks" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Files" })).not.toHaveAttribute("aria-current");
        expect(screen.getByRole("link", { name: "Templates" })).toHaveAttribute("href", "/library/templates");
    });
    it("keeps legacy review links selected under Workflows", () => {
        state.pathname = "/tabular-reviews/review-1";
        render(<WorkspaceSectionNav />);
        expect(screen.getByRole("link", { name: "Reviews" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Saved workflows" })).toHaveAttribute("href", "/workflows");
    });
});
