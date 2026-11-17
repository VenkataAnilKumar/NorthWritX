import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectOverview } from "./ProjectOverview";
const { state } = vi.hoisted(() => ({ state: { project: null as Record<string, unknown> | null, projectLoading: false, canDo: vi.fn(), openProjectDetails: vi.fn() } }));
vi.mock("./ProjectWorkspace", () => ({
    useProjectWorkspace: () => state,
    ProjectSectionToolbar: ({ actions }: { actions?: React.ReactNode }) => <div>{actions}</div>,
}));
beforeEach(() => {
    vi.clearAllMocks();
    state.projectLoading = false;
    state.project = { id: "p", org_id: null, name: "Matter", cm_number: "REF", matter_status: "open" };
    state.canDo.mockReturnValue(true);
});
describe("Matter overview", () => {
    it("shows explicit legacy blanks, personal context and an owner editing action", async () => {
        render(<ProjectOverview />);
        expect(screen.getAllByText("Not specified")).toHaveLength(3);
        expect(screen.getByText("Personal")).toBeVisible();
        expect(screen.getByText("Open")).toBeVisible();
        await userEvent.click(screen.getByRole("button", { name: "Edit matter details" }));
        expect(state.openProjectDetails).toHaveBeenCalledOnce();
    });
    it("renders organization context and full long values without editing for readers", () => {
        state.project = { ...state.project, client_name: "Long".repeat(80), org_id: "org", organization_name: "Firm" };
        state.canDo.mockReturnValue(false);
        render(<ProjectOverview />);
        expect(screen.getByText("Long".repeat(80))).toBeVisible();
        expect(screen.getByText("Firm")).toBeVisible();
        expect(screen.queryByRole("button", { name: "Edit matter details" })).toBeNull();
    });
    it("announces loading and hides controls until the role is known", () => {
        state.projectLoading = true; state.project = null;
        render(<ProjectOverview />);
        expect(screen.getByRole("status")).toHaveTextContent("Loading matter overview");
        expect(screen.getByRole("region", { name: "Matter overview" })).toHaveAttribute("aria-busy", "true");
        expect(screen.queryByRole("button")).toBeNull();
    });
    it("shows unavailable rather than empty invented metadata after load failure", () => {
        state.project = null;
        render(<ProjectOverview />);
        expect(screen.getByRole("status")).toHaveTextContent("Matter unavailable");
        expect(screen.queryByText("Not specified")).toBeNull();
    });
});
