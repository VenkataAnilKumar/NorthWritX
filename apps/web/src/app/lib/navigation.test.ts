import { describe, expect, it } from "vitest";
import { primaryDestination, sectionIsActive } from "./navigation";

describe("workspace navigation", () => {
    it.each([
        ["/assistant/chat/chat-1", "/assistant"],
        ["/history", "/assistant"],
        ["/projects/matter-1/assistant/chat/chat-1", "/projects"],
        ["/projects/matter-1/tabular-reviews/review-1", "/projects"],
        ["/library/templates/folders/folder-1", "/library"],
        ["/playbooks/playbook-1", "/library"],
        ["/tabular-reviews/review-1", "/workflows"],
        ["/workflows/assistant/workflow-1", "/workflows"],
        ["/ide", "/settings"],
        ["/settings/advanced", "/settings"],
        ["/projects-unrelated", null],
    ])("groups legacy and nested route %s under %s", (route, destination) => {
        expect(primaryDestination(route)).toBe(destination);
    });

    it("does not select Files for templates or playbooks", () => {
        expect(sectionIsActive("/library/templates/folders/one", "/library")).toBe(false);
        expect(sectionIsActive("/playbooks/one", "/library")).toBe(false);
        expect(sectionIsActive("/library/folders/one", "/library")).toBe(true);
        expect(sectionIsActive("/library/templates/folders/one", "/library/templates")).toBe(true);
        expect(sectionIsActive("/tabular-reviews/one", "/workflows")).toBe(false);
    });
});
