import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import SupportPage from "./page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock("@/app/contexts/AuthContext", () => ({
    useAuth: () => ({ isAuthenticated: true, authLoading: false }),
}));

it("prepares a support draft with the user's text and no inherited recipient", async () => {
    const user = userEvent.setup();
    render(<SupportPage />);
    await user.type(screen.getByLabelText("Subject"), "Upload & review");
    await user.type(screen.getByLabelText("Message"), "The upload did not finish.");
    await user.click(screen.getByRole("button", { name: "Prepare email" }));
    const draft = screen.getByRole("link", { name: "Open email draft" });
    expect(draft).toHaveAttribute(
        "href",
        "mailto:?subject=Upload%20%26%20review&body=The%20upload%20did%20not%20finish.",
    );
    await user.type(screen.getByLabelText("Message"), " Please check.");
    expect(draft).not.toBeInTheDocument();
});
