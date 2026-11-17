import { test, expect } from "./fixtures";

test.use({ storageState: { cookies: [], origins: [] } });

for (const role of ["owner", "viewer"] as const) {
    test(`Matter overview and settings respect ${role} access`, async ({ page }, testInfo) => {
        test.setTimeout(120_000);
        const pageErrors: string[] = [];
        page.on("pageerror", error => pageErrors.push(error.message));
        let project = {
            id: "synthetic-matter", user_id: "synthetic-user", name: "Synthetic contract matter",
            cm_number: "NW-2026-001", practice: "Commercial", org_id: null,
            visibility: "private", access_role: role, memory_enabled: false,
            client_name: "Synthetic".repeat(30), jurisdiction: "Ontario", matter_status: "open",
            documents: [], folders: [], created_at: "2026-11-16T00:00:00Z", updated_at: "2026-11-16T00:00:00Z",
        };
        const writes: unknown[] = [];
        await page.route("**/api/**", async route => {
            const path = new URL(route.request().url()).pathname;
            if (path === "/api/auth/session") return route.fulfill({ json: { user: { id: "synthetic-user", email: "synthetic@northwrit.local" } } });
            if (path === "/api/user/profile") return route.fulfill({ json: { onboardingComplete: true, displayName: "Synthetic", apiKeyStatus: {}, creditsRemaining: 100 } });
            if (path === "/api/projects/synthetic-matter") {
                if (route.request().method() === "PATCH") {
                    const body = route.request().postDataJSON();
                    writes.push(body);
                    if (role !== "owner") return route.fulfill({ status: 403, json: { detail: "Owner access required" } });
                    project = { ...project, ...body };
                }
                return route.fulfill({ json: project });
            }
            if (path === "/api/models/configured" || path === "/api/models/ollama") return route.fulfill({ json: { models: [] } });
            return route.fulfill({ json: [] });
        });
        await page.goto("/projects/synthetic-matter/overview");
        const overview = page.getByRole("region", { name: "Matter overview" });
        await expect(overview.getByText("NW-2026-001")).toBeVisible();
        await expect(overview.getByText("Synthetic".repeat(30))).toBeVisible();
        const edit = page.getByRole("button", { name: "Edit matter details", exact: true });
        if (role === "owner") {
            await edit.focus();
            await expect(edit).toBeFocused();
            await page.keyboard.press("Enter");
            await page.getByLabel("Client name", { exact: true }).fill("New synthetic client");
            await page.getByLabel("Jurisdiction", { exact: true }).fill("");
            await page.getByRole("button", { name: "Update", exact: true }).click();
            await expect(page.getByRole("status").filter({ hasText: "Updated" })).toBeVisible();
            expect(writes).toContainEqual(expect.objectContaining({ client_name: "New synthetic client", jurisdiction: null }));
            await page.keyboard.press("Escape");
            await expect(overview.getByText("New synthetic client")).toBeVisible();
        } else {
            await expect(edit).toHaveCount(0);
            expect(writes).toEqual([]);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
        await page.evaluate(() => document.documentElement.classList.add("dark"));
        await expect(overview).toBeVisible();
        if (role === "owner") {
            await edit.click();
            await expect(page.getByLabel("Client name", { exact: true })).toBeVisible();
            await page.keyboard.press("Escape");
            await expect(page.getByLabel("Client name", { exact: true })).toBeHidden();
        }
        expect(await overview.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`matter-overview-${role}.png`), fullPage: true });
        await page.emulateMedia({ forcedColors: "active" });
        await expect(overview).toBeVisible();
        await page.getByRole("button", { name: "Documents", exact: true }).click();
        await expect(page).toHaveURL(/\/projects\/synthetic-matter$/);
        expect(pageErrors).toEqual([]);
    });
}
