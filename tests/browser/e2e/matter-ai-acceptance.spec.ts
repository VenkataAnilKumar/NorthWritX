// Opt-in connected test. The isolated runner provides a previously verified AI answer in disposable persisted fixtures.
import fs from "node:fs/promises";
import { test, expect } from "@playwright/test";
import JSZip from "../../../apps/api/node_modules/jszip";

test("persisted AI answer opens its source and exports its saved draft", async ({ browser, baseURL }) => {
    test.setTimeout(180_000);
    const fixture = JSON.parse(await fs.readFile(process.env.NORTHWRIT_ACCEPTANCE_MANIFEST!, "utf8")) as {
        matterId: string; chatId: string; draftId: string; answer: string;
        sourceId: string; sourceVersionId: string;
        owner: { email: string; password: string };
    };
    const context = await browser.newContext({ baseURL, extraHTTPHeaders: { Origin: baseURL! } });
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
        await page.goto("/login");
        await page.locator("#email").fill(fixture.owner.email);
        await page.locator("#password").fill(fixture.owner.password);
        await page.locator('button[type="submit"]').click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
        await page.goto(`/projects/${fixture.matterId}/assistant/chat/${fixture.chatId}`);
        await expect(page.getByText(/47 calendar days/).first()).toBeVisible();
        await expect(page.getByRole("heading", { name: "Citations", exact: true })).toBeVisible();
        const citation = page.getByRole("button", { name: /^Citation \d+$/ }).first();
        await expect(citation).toBeVisible();
        const sourceRead = page.waitForResponse(response => new URL(response.url()).pathname.endsWith(`/single-documents/${fixture.sourceId}`) && response.status() === 200);
        await page.getByRole("button", { name: "Trial-Amendment.docx", exact: true }).first().click();
        const openedSource = await (await sourceRead).json();
        expect(openedSource.current_version_id).toBe(fixture.sourceVersionId);
        await expect(page.getByText(/47 calendar days/).first()).toBeVisible();
        console.log("STEP persisted AI answer and amendment source opened");
        await page.goto(`/projects/${fixture.matterId}/drafts`);
        await page.getByRole("button", { name: /Notice period finding/ }).click();
        await expect(page.getByLabel("Draft text", { exact: true })).toHaveValue(fixture.answer);
        const pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "Export revision 1 DOCX", exact: true }).click();
        const download = await pending;
        const zip = await JSZip.loadAsync(await fs.readFile((await download.path())!));
        const xml = await zip.file("word/document.xml")!.async("string");
        expect(xml).toMatch(/47 (calendar )?days/);
        expect(xml).toContain(fixture.sourceVersionId);
        expect(errors).toEqual([]);
        console.log("STEP AI draft body and browser DOCX download verified");
    } finally { await context.close(); }
});
