import { test, expect } from "./fixtures";
import type { WorkProductDraftInput, WorkProductReadResponse, WorkProductVersion } from "@northwrit/contracts";

test.use({ storageState: { cookies: [], origins: [] } });
for (const role of ["owner", "viewer"] as const) {
    test(`Matter draft editing, history and export respect ${role} access`, async ({ page }, testInfo) => {
        test.setTimeout(120_000);
        const pageErrors: string[] = [];
        page.on("pageerror", error => pageErrors.push(error.message));
        const matter = "synthetic-matter";
        const now = "2026-11-17T12:00:00Z";
        const longTitle = "Synthetic".repeat(20);
        const doc = { id: "synthetic-doc", project_id: matter, filename: `${"LongSource".repeat(20)}.docx`, current_version_id: "doc-version", content_sha256: "a".repeat(64), active_version_number: 1, status: "ready", file_type: "docx" };
        const product = { id: "draft-1", project_id: matter, title: "Advice", current_version_id: "revision-2", created_at: now, updated_at: now };
        const versions: WorkProductVersion[] = [2, 1].map(revision => ({ id: `revision-${revision}`, work_product_id: product.id, revision, based_on_version_id: revision > 1 ? `revision-${revision-1}` : null, title: revision === 2 ? "Advice" : "Original advice", body: `Saved draft text ${revision}`, scope: "Synthetic contract review", assumptions: "No client information", sources: [{ document_id: doc.id, version_id: doc.current_version_id, content_sha256: doc.content_sha256, filename: doc.filename, version_number: 1, locator: "Section 4" }], created_by: "synthetic-user", author_label: "Synthetic".repeat(25), created_at: now }));
        const writes: WorkProductDraftInput[] = [];
        const exports: string[] = [];
        let failNextSave = false;
        let stale = false;
        await page.route("**/api/**", async route => {
            const path = new URL(route.request().url()).pathname;
            const method = route.request().method();
            if (path === "/api/auth/session") return route.fulfill({ json: { user: { id: "synthetic-user", email: "synthetic@northwrit.local" } } });
            if (path === "/api/user/profile") return route.fulfill({ json: { onboardingComplete: true, displayName: "Synthetic", apiKeyStatus: {}, creditsRemaining: 100 } });
            if (path === `/api/projects/${matter}`) return route.fulfill({ json: { id: matter, user_id: "synthetic-user", name: "Synthetic matter", access_role: role, org_id: null, visibility: "private", memory_enabled: false, documents: [doc, { ...doc, id: "legacy-doc", filename: "Unhashed.docx", content_sha256: null }], folders: [], created_at: now, updated_at: now } });
            const base = `/api/projects/${matter}/work-products`;
            if (path.startsWith(`${base}/recoveries`)) {
                if (method === "DELETE") return route.fulfill({ status: 204 });
                if (method === "POST") return route.fulfill({ json: { ...route.request().postDataJSON(), id: path.split("/").at(-1), project_id: matter, updated_at: now, expires_at: "2026-11-18T12:00:00Z" } });
                return route.fulfill({ json: { items: [] } });
            }
            if (path.startsWith(base)) {
                if (method === "POST" && path.endsWith("/export")) {
                    exports.push(path);
                    if (stale) return route.fulfill({ status: 409, json: { detail: "Source references changed or are unavailable." } });
                    return route.fulfill({ contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers: { "Content-Disposition": 'attachment; filename="Advice - draft.docx"' }, body: Buffer.from("Synthetic export bytes; actual DOCX rendering is verified by isolated API integration tests.") });
                }
                if (method === "POST") {
                    const input = route.request().postDataJSON() as WorkProductDraftInput;
                    writes.push(input);
                    if (role !== "owner") return route.fulfill({ status: 403, json: { detail: "Editor access required" } });
                    if (failNextSave) { failNextSave = false; return route.fulfill({ status: 409, json: { detail: "The draft changed. Reload and review." } }); }
                    expect(input.expected_version_id).toBe(product.current_version_id);
                    const next = { ...versions[0], ...input, id: `revision-${versions.length + 1}`, revision: versions.length + 1, based_on_version_id: product.current_version_id, sources: input.sources.map(ref => ({ ...ref, filename: doc.filename, version_number: 1 })) };
                    product.current_version_id = next.id; product.title = next.title; versions.unshift(next);
                    return route.fulfill({ status: 201, json: { work_product: product, version: next, idempotent: false } });
                }
                if (path === base) return route.fulfill({ json: { items: [product] } });
                if (path.endsWith("/versions")) return route.fulfill({ json: { current_version_id: product.current_version_id, versions } });
                const id = path.split("/versions/")[1];
                const version = id ? versions.find(item => item.id === id)! : versions[0];
                const read: WorkProductReadResponse = { work_product: product, version, evidence_status: stale ? "changed_or_unavailable" : "current" };
                return route.fulfill({ json: read });
            }
            if (path === "/api/models/configured" || path === "/api/models/ollama") return route.fulfill({ json: { models: [] } });
            return route.fulfill({ json: [] });
        });
        await page.goto(`/projects/${matter}/drafts`);
        const drafts = page.getByRole("region", { name: "Matter drafts", exact: true });
        await drafts.getByRole("button", { name: /^Advice/ }).click();
        await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue("Saved draft text 2");
        await expect(drafts.getByText("DRAFT — NOT APPROVED", { exact: true })).toBeVisible();
        if (role === "owner") {
            await page.getByLabel("Draft title", { exact: true }).fill(longTitle);
            await page.getByLabel("Draft text", { exact: true }).fill("Unsaved advice");
            await page.getByTitle("Back to Matters", { exact: true }).filter({ visible: true }).click();
            await expect(page.getByRole("dialog", { name: "Discard unsaved draft changes?" })).toBeVisible();
            await page.getByRole("button", { name: "Keep editing", exact: true }).click();
            await page.getByRole("button", { name: "Documents", exact: true }).click();
            await expect(page.getByRole("dialog", { name: "Discard unsaved draft changes?" })).toBeVisible();
            await page.getByRole("button", { name: "Keep editing", exact: true }).click();
            await expect(page).toHaveURL(/\/drafts$/);
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue("Unsaved advice");
            const download = page.waitForEvent("download");
            await page.getByRole("button", { name: "Export revision 2 DOCX", exact: true }).click();
            expect((await download).suggestedFilename()).toBe("Advice - draft.docx");
            expect(exports.at(-1)).toContain("/revision-2/export");
            failNextSave = true;
            await page.getByRole("button", { name: "Save revision", exact: true }).click();
            await expect(drafts.getByText(/Save conflict:/)).toBeVisible();
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue("Unsaved advice");
            await expect(page.getByRole("button", { name: "Save revision", exact: true })).toBeDisabled();
            await drafts.getByRole("button", { name: "Reload current revision", exact: true }).first().click();
            await page.getByRole("button", { name: "Discard changes", exact: true }).click();
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue("Saved draft text 2");
            await page.getByLabel("Draft title", { exact: true }).fill(longTitle);
            await page.getByLabel("Draft text", { exact: true }).fill("Reviewed synthetic advice");
            await page.getByLabel("Source 1 locator", { exact: true }).fill("Section 5");
            await page.getByRole("button", { name: "Save revision", exact: true }).click();
            await expect(drafts.getByRole("heading", { name: "Revision 3 · Current when loaded", exact: true })).toBeVisible();
            expect(writes.at(-1)).toMatchObject({ expected_version_id: "revision-2", sources: [{ document_id: doc.id, version_id: "doc-version", content_sha256: "a".repeat(64), locator: "Section 5" }] });
            const history = page.getByRole("region", { name: "Revision history", exact: true });
            await history.getByRole("button", { name: /^Revision 1 ·/ }).click();
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveAttribute("readonly", "");
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue("Saved draft text 1");
            await page.getByRole("button", { name: "Restore as new revision", exact: true }).click();
            await expect(drafts.getByRole("heading", { name: "Revision 4 · Current when loaded", exact: true })).toBeVisible();
            expect(writes.at(-1)).toMatchObject({ expected_version_id: "revision-3", body: "Saved draft text 1" });
            const newDraft = page.getByRole("button", { name: "New draft", exact: true });
            await newDraft.focus();
            await expect(newDraft).toBeFocused();
            await page.keyboard.press("Enter");
            await page.getByLabel("Draft title", { exact: true }).fill(longTitle);
            await page.getByLabel("Draft text", { exact: true }).fill("New unsaved text");
            await page.getByLabel("Add matter document", { exact: true }).selectOption(doc.id);
            await expect(page.getByLabel("Source 1 locator", { exact: true })).toBeVisible();
            await expect(page.getByRole("option", { name: /Unhashed.docx/ })).toBeDisabled();
        } else {
            await expect(page.getByRole("button", { name: "New draft", exact: true })).toHaveCount(0);
            await expect(page.getByRole("button", { name: "Save revision", exact: true })).toHaveCount(0);
            await expect(page.getByLabel("Draft text", { exact: true })).toHaveAttribute("readonly", "");
            await page.getByRole("region", { name: "Revision history", exact: true }).getByRole("button", { name: /^Revision 1 ·/ }).click();
            await expect(page.getByRole("button", { name: "Restore as new revision", exact: true })).toHaveCount(0);
            const download = page.waitForEvent("download");
            await page.getByRole("button", { name: "Export revision 1 DOCX", exact: true }).click();
            await download;
            expect(exports.at(-1)).toContain("/revision-1/export");
            stale = true;
            await page.getByRole("button", { name: "Reload current revision", exact: true }).click();
            await expect(drafts.getByText(/Sources changed or are unavailable/)).toBeVisible();
            await expect(page.getByRole("button", { name: "Export revision 2 DOCX", exact: true })).toBeDisabled();
            expect(writes).toEqual([]);
        }
        await page.screenshot({ path: testInfo.outputPath(`matter-drafts-${role}-desktop.png`), fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
        await page.evaluate(() => document.documentElement.classList.add("dark"));
        expect(await drafts.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`matter-drafts-${role}-mobile.png`), fullPage: true });
        await page.emulateMedia({ forcedColors: "active" });
        await expect(page.getByLabel("Draft text", { exact: true })).toBeVisible();
        await page.getByRole("button", { name: "Documents", exact: true }).click();
        if (role === "owner") await page.getByRole("button", { name: "Discard changes", exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/projects/${matter}$`));
        await page.getByRole("button", { name: "Drafts", exact: true }).click();
        await expect(page).toHaveURL(/\/drafts$/);
        expect(pageErrors).toEqual([]);
    });
}
