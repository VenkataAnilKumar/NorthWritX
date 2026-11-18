// Opt-in connected test. The isolated runner provides a previously verified AI answer in disposable persisted fixtures.
import fs from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";
import JSZip from "../../../apps/api/node_modules/jszip";

test("persisted AI answer opens its source and exports its saved draft", async ({ browser, baseURL }) => {
    test.setTimeout(180_000);
    const fixture = JSON.parse(await fs.readFile(process.env.NORTHWRIT_ACCEPTANCE_MANIFEST!, "utf8")) as {
        matterId: string; chatId: string; draftId: string; answer: string;
        sourceId: string; sourceVersionId: string; captureDirectory?: string;
        owner: { email: string; password: string };
    };
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, baseURL, extraHTTPHeaders: { Origin: baseURL! } });
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    async function capture(name: string) {
        if (!fixture.captureDirectory) return;
        await fs.mkdir(fixture.captureDirectory, { recursive: true });
        await page.screenshot({ path: path.join(fixture.captureDirectory, `${name}.png`), animations: "disabled" });
    }
    try {
        await page.goto("/login");
        await page.locator("#email").fill(fixture.owner.email);
        await page.locator("#password").fill(fixture.owner.password);
        await page.locator('button[type="submit"]').click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
        if (fixture.captureDirectory) {
            const modelSelection = await page.request.patch(`/api/chat/${fixture.chatId}`, { data: { model: "ollama/qwen2.5:3b" } });
            expect(modelSelection.ok()).toBe(true);
            await page.goto(`/projects/${fixture.matterId}/overview`);
            await expect(page.getByRole("region", { name: "Matter overview" })).toHaveAttribute("aria-busy", "false");
            await capture("01-matter-overview");
            await page.goto(`/projects/${fixture.matterId}`);
            await expect(page.getByText("Trial-Amendment.docx", { exact: true }).first()).toBeVisible();
            await capture("02-matter-documents");
        }
        await page.goto(`/projects/${fixture.matterId}/assistant/chat/${fixture.chatId}`);
        await expect(page.getByText(/47 calendar days/).first()).toBeVisible();
        await expect(page.getByRole("heading", { name: "Citations", exact: true })).toBeVisible();
        const citation = page.getByRole("button", { name: /^Citation \d+$/ }).first();
        await expect(citation).toBeVisible();
        await capture("03-ai-answer-and-citations");
        const sourceRead = page.waitForResponse(response => new URL(response.url()).pathname.endsWith(`/single-documents/${fixture.sourceId}`) && response.status() === 200);
        await page.getByRole("button", { name: "Trial-Amendment.docx", exact: true }).first().click();
        const openedSource = await (await sourceRead).json();
        expect(openedSource.current_version_id).toBe(fixture.sourceVersionId);
        await expect(page.getByText(/47 calendar days/).first()).toBeVisible();
        if (fixture.captureDirectory) {
            await expect(page.getByRole("status", { name: "Loading document", exact: true })).toBeHidden({ timeout: 60_000 });
            await page.getByRole("button", { name: /^Citation \d+$/ }).last().click();
        }
        await capture("04-cited-amendment");
        console.log("STEP persisted AI answer and amendment source opened");
        await page.goto(`/projects/${fixture.matterId}/drafts`);
        await page.getByRole("button", { name: /Notice period finding/ }).click();
        await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue(fixture.answer);
        await capture("05-saved-ai-draft");
        const pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "Export revision 1 DOCX", exact: true }).click();
        const download = await pending;
        if (fixture.captureDirectory) await download.saveAs(path.join(fixture.captureDirectory, "Notice-period-finding.docx"));
        await capture("06-docx-export");
        const zip = await JSZip.loadAsync(await fs.readFile((await download.path())!));
        const xml = await zip.file("word/document.xml")!.async("string");
        expect(xml).toMatch(/47 (calendar )?days/);
        expect(xml).toContain(fixture.sourceVersionId);
        if (fixture.captureDirectory) {
            await page.getByLabel("Draft text", { exact: true }).fill(fixture.answer + "\n\nReviewer note: confirm the notice delivery date before acting.");
            await page.getByRole("button", { name: "Save revision", exact: true }).click();
            await expect(page.getByRole("heading", { name: "Revision 2 · Current when loaded", exact: true })).toBeVisible();
            await page.getByRole("region", { name: "Revision history", exact: true }).scrollIntoViewIfNeeded();
            await capture("07-draft-revision-history");
        }
        expect(errors).toEqual([]);
        console.log("STEP AI draft body and browser DOCX download verified");
    } finally { await context.close(); }
});
