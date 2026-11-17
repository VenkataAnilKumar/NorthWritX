import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NorthWritApiError, listOrgs } from "@/app/lib/northwritApi";
import type { Project } from "@/app/components/shared/types";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

vi.mock("@/app/lib/northwritApi", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/app/lib/northwritApi")>()),
    listOrgs: vi.fn(),
}));

vi.mock("./ProjectPracticeField", () => ({
    ProjectPracticeField: ({
        id,
        value,
        disabled,
    }: {
        id: string;
        value: string;
        disabled?: boolean;
    }) => (
        <button id={id} type="button" disabled={disabled}>
            {value || "None"}
        </button>
    ),
}));

const project = {
    id: "project-1",
    user_id: "user-1",
    org_id: "org-1",
    name: "Matter",
    cm_number: "CM-123",
    practice: "Litigation",
    memory_enabled: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
} satisfies Project;

describe("ProjectDetailsModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(listOrgs).mockResolvedValue([
            { id: "org-1", name: "Elite Law LLP" } as never,
        ]);
    });

    it("shows the current organisation in project details", async () => {
        render(
            <ProjectDetailsModal
                open
                project={project}
                canEdit
                onClose={vi.fn()}
                onSave={vi.fn()}
            />,
        );

        const organisation = await screen.findByLabelText("Organisation");
        expect(organisation).toBeDisabled();
        expect(organisation).toHaveTextContent("Elite Law LLP");
    });

    it("names the organisation from the row when the org list fails", async () => {
        // The select falls back to its raw value when no option matches, so a
        // failed listOrgs used to show the organization's UUID.
        vi.mocked(listOrgs).mockRejectedValue(new Error("network"));
        render(
            <ProjectDetailsModal
                open
                project={{
                    ...project,
                    organization_name: "Elite Law LLP",
                }}
                canEdit
                onClose={vi.fn()}
                onSave={vi.fn()}
            />,
        );

        const organisation = await screen.findByLabelText("Organisation");
        expect(organisation).toHaveTextContent("Elite Law LLP");
        expect(organisation).not.toHaveTextContent("org-1");
    });

    it("reports what an intentional refusal said instead of a generic line", async () => {
        const user = userEvent.setup();
        render(
            <ProjectDetailsModal
                open
                project={project}
                canEdit
                onClose={vi.fn()}
                onSave={vi
                    .fn()
                    .mockRejectedValue(
                        new NorthWritApiError({
                            status: 409,
                            message: "A project with that CM number exists.",
                        }),
                    )}
            />,
        );

        await user.clear(screen.getByLabelText("Matter name"));
        await user.type(screen.getByLabelText("Matter name"), "Renamed");
        await user.click(screen.getByRole("button", { name: "Update" }));

        expect(
            await screen.findByText("A project with that CM number exists."),
        ).toBeInTheDocument();
    });

    // Whether a project is public or private is one of its details. Public
    // opens it to the whole organisation; private keeps it to the people it
    // is shared with.
    describe("Public setting", () => {
        const orgProject = (overrides: Partial<Project> = {}) =>
            ({
                ...project,
                organization_name: "Elite Law LLP",
                visibility: "private",
                ...overrides,
            }) as Project;

        it("shows the project's current setting and saves a change with the other details", async () => {
            const user = userEvent.setup();
            const onSave = vi.fn().mockResolvedValue(undefined);
            render(
                <ProjectDetailsModal
                    open
                    project={orgProject()}
                    canEdit
                    onClose={vi.fn()}
                    onSave={onSave}
                />,
            );

            const toggle = screen.getByRole("button", { name: "Public" });
            expect(toggle).toHaveAttribute("aria-pressed", "false");
            expect(
                screen.getByRole("button", { name: "Private" }),
            ).toHaveAttribute("aria-pressed", "true");
            // Nothing changed yet, so nothing to save.
            expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();

            await user.click(toggle);
            expect(
                screen.getByText(
                    "Everyone in Elite Law LLP can open and edit this project.",
                ),
            ).toBeInTheDocument();
            await user.click(screen.getByRole("button", { name: "Update" }));

            expect(onSave).toHaveBeenCalledWith({
                name: "Matter",
                cmNumber: "CM-123",
                practice: "Litigation",
                visibility: "organization",
            });
        });

        it("makes a public project private again", async () => {
            const user = userEvent.setup();
            const onSave = vi.fn().mockResolvedValue(undefined);
            render(
                <ProjectDetailsModal
                    open
                    project={orgProject({ visibility: "organization" })}
                    canEdit
                    onClose={vi.fn()}
                    onSave={onSave}
                />,
            );

            expect(
                screen.getByRole("button", { name: "Public" }),
            ).toHaveAttribute("aria-pressed", "true");
            await user.click(screen.getByRole("button", { name: "Private" }));
            await user.click(screen.getByRole("button", { name: "Update" }));

            expect(onSave).toHaveBeenCalledWith(
                expect.objectContaining({ visibility: "private" }),
            );
        });

        it("leaves the setting out when only other details changed", async () => {
            const user = userEvent.setup();
            const onSave = vi.fn().mockResolvedValue(undefined);
            render(
                <ProjectDetailsModal
                    open
                    project={orgProject()}
                    canEdit
                    onClose={vi.fn()}
                    onSave={onSave}
                />,
            );

            const name = screen.getByLabelText("Matter name");
            await user.clear(name);
            await user.type(name, "Renamed");
            await user.click(screen.getByRole("button", { name: "Update" }));

            expect(onSave).toHaveBeenCalledTimes(1);
            expect(onSave.mock.calls[0][0]).not.toHaveProperty("visibility");
        });

        it("shows the setting, unchangeable, to somebody who cannot edit the project", () => {
            render(
                <ProjectDetailsModal
                    open
                    project={orgProject({ visibility: "organization" })}
                    canEdit={false}
                    onClose={vi.fn()}
                    onSave={vi.fn()}
                />,
            );
            const toggle = screen.getByRole("button", { name: "Public" });
            expect(toggle).toHaveAttribute("aria-pressed", "true");
            expect(toggle).toBeDisabled();
            expect(screen.getByRole("button", { name: "Private" })).toBeDisabled();
        });

        it("is not offered for a personal project", () => {
            render(
                <ProjectDetailsModal
                    open
                    project={{ ...project, org_id: null }}
                    canEdit
                    onClose={vi.fn()}
                    onSave={vi.fn()}
                />,
            );
            expect(
                screen.queryByRole("group", { name: "Organisational Access" }),
            ).not.toBeInTheDocument();
        });
    });
    it("saves only changed metadata and permits explicit clearing", async () => {
        const user = userEvent.setup();
        const onSave = vi.fn().mockResolvedValue(undefined);
        render(<ProjectDetailsModal open project={{ ...project, client_name: "Client", jurisdiction: "Ontario", matter_status: "open" }} canEdit onClose={vi.fn()} onSave={onSave} />);
        await user.clear(screen.getByLabelText("Client name"));
        await user.click(screen.getByLabelText("Matter status"));
        await user.click(screen.getByRole("menuitem", { name: /^Closed$/ }));
        await user.click(screen.getByRole("button", { name: "Update" }));
        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ client_name: null, matter_status: "closed" }));
        expect(onSave.mock.calls[0][0]).not.toHaveProperty("jurisdiction");
    });
    it("blocks over-limit metadata and preserves entered values", () => {
        const onSave = vi.fn();
        render(<ProjectDetailsModal open project={project} canEdit onClose={vi.fn()} onSave={onSave} />);
        fireEvent.change(screen.getByLabelText("Client name"), { target: { value: "x".repeat(201) } });
        expect(screen.getByRole("alert")).toHaveTextContent("at most 200");
        expect(screen.getByLabelText("Client name")).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
        expect(onSave).not.toHaveBeenCalled();
    });
    it("disables all new metadata controls for read-only users", () => {
        render(<ProjectDetailsModal open project={project} canEdit={false} onClose={vi.fn()} onSave={vi.fn()} />);
        for (const name of ["Client name", "Jurisdiction", "Matter status"]) expect(screen.getByLabelText(name)).toBeDisabled();
        expect(screen.queryByRole("button", { name: "Update" })).toBeNull();
    });

    it("keeps success feedback visible when the saved detail response refreshes the parent", async () => {
        function Harness() {
            const [current, setCurrent] = useState<Project>(project);
            return <ProjectDetailsModal open project={current} canEdit onClose={vi.fn()}
                onSave={async (values) => { setCurrent(prev => ({ ...prev, client_name: values.client_name })); }} />;
        }
        const user = userEvent.setup();
        render(<Harness />);
        await user.type(screen.getByLabelText("Client name"), "Client");
        await user.click(screen.getByRole("button", { name: "Update" }));
        expect(await screen.findByRole("status")).toHaveTextContent("Updated");
    });

});
