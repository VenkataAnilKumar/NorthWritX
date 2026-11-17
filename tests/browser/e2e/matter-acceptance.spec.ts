// Connected acceptance: every response comes from disposable real services.
// Provision only through apps/api/scripts/verify-source-journey.cjs --acceptance.
import fs from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import JSZip from "../../../apps/api/node_modules/jszip";

test("connected matter source draft export and two-user revocation", async ({ browser, baseURL }) => {
    test.setTimeout(240_000);
    const fixture = JSON.parse(await fs.readFile(process.env.NORTHWRIT_ACCEPTANCE_MANIFEST!, "utf8")) as {
        matterId: string; foreignMatterId: string; foreignSourceId: string; sourceFile: string;
        owner: { email: string; password: string }; viewer: { email: string; password: string };
    };
    // APIRequestContext shares these cookies but does not add a browser Origin.
    // Use the actual web origin so negative writes exercise content permissions.
    const ownerContext = await browser.newContext({ baseURL, extraHTTPHeaders: { Origin: baseURL! } });
    const viewerContext = await browser.newContext({ baseURL, extraHTTPHeaders: { Origin: baseURL! } });
    const owner = await ownerContext.newPage(), viewer = await viewerContext.newPage();
    owner.setDefaultTimeout(15_000); viewer.setDefaultTimeout(15_000);
    const pageErrors: string[] = [];
    for (const page of [owner, viewer]) page.on("pageerror", error => pageErrors.push(error.message));
    async function signIn(page: Page, account: { email: string; password: string }) {
        await page.goto("/login");
        await page.locator("#email").fill(account.email);
        await page.locator("#password").fill(account.password);
        await page.locator('button[type="submit"]').click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
        const session = await page.request.get("/api/auth/session");
        expect(session.status()).toBe(200);
    }
    async function downloadXml(page: Page, name: string) {
        const pending = page.waitForEvent("download");
        await page.getByRole("button", { name, exact: true }).click();
        const download = await pending;
        expect(download.suggestedFilename()).toMatch(/draft.*\.docx$/);
        const zip = await JSZip.loadAsync(await fs.readFile((await download.path())!));
        return zip.file("word/document.xml")!.async("string");
    }
    try {
        await signIn(owner, fixture.owner);
        console.log("STEP owner signed in");
        await owner.goto(`/projects/${fixture.matterId}/overview`);
        await expect(owner.getByRole("region", { name: "Matter overview" })).toBeVisible();
        await owner.getByRole("button", { name: "Documents", exact: true }).click();
        await owner.getByRole("button", { name: "Upload", exact: true }).filter({ visible: true }).first().click();
        const picker = owner.waitForEvent("filechooser");
        await owner.getByRole("menuitem", { name: "Upload Documents", exact: true }).click();
        await (await picker).setFiles(fixture.sourceFile);
        let source: { id: string; current_version_id: string; content_sha256: string; status: string };
        await expect.poll(async () => {
            const response = await owner.request.get(`/api/projects/${fixture.matterId}`);
            expect(response.status()).toBe(200);
            const project = await response.json();
            source = project.documents.find((doc: { filename: string }) => doc.filename === "Connected-Source.docx");
            return source?.status;
        }, { timeout: 120_000, intervals: [500, 1000] }).toBe("ready");
        console.log("STEP UI source upload processed");
        expect(source!.content_sha256).toMatch(/^[a-f0-9]{64}$/);
        await owner.getByRole("button", { name: "Drafts", exact: true }).click();
        await owner.getByRole("button", { name: "New draft", exact: true }).click();
        await owner.getByLabel("Draft title", { exact: true }).fill("Connected advice");
        await owner.getByLabel("Draft text", { exact: true }).fill("Original connected advice based on the synthetic contract.");
        await owner.getByLabel("Scope", { exact: true }).fill("Ontario synthetic contract");
        await owner.getByLabel("Assumptions", { exact: true }).fill("Synthetic facts only");
        await owner.getByRole("button", { name: "Refresh source list", exact: true }).click();
        await expect(owner.getByRole("option", { name: /Connected-Source.docx/ })).toBeEnabled();
        await owner.getByLabel("Add matter document", { exact: true }).selectOption(source!.id);
        console.log("STEP exact source selected");
        await owner.getByLabel("Source 1 locator", { exact: true }).fill("Opening paragraph");
        const savedResponse = owner.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith(`/projects/${fixture.matterId}/work-products`));
        await owner.getByRole("button", { name: "Save revision", exact: true }).click();
        const saved = await (await savedResponse).json();
        console.log("STEP first draft saved");
        await expect(owner.getByRole("heading", { name: "Revision 1 · Current when loaded", exact: true })).toBeVisible();
        expect(saved.version.sources[0]).toMatchObject({ document_id: source!.id, version_id: source!.current_version_id, content_sha256: source!.content_sha256 });
        await owner.getByLabel("Draft text", { exact: true }).fill("Revised connected advice.");
        await owner.getByRole("button", { name: "Save revision", exact: true }).click();
        await expect(owner.getByRole("heading", { name: "Revision 2 · Current when loaded", exact: true })).toBeVisible();
        await owner.getByRole("region", { name: "Revision history", exact: true }).getByRole("button", { name: /^Revision 1 ·/ }).click();
        await expect(owner.getByLabel("Draft text", { exact: true })).toHaveAttribute("readonly", "");
        await owner.getByRole("button", { name: "Restore as new revision", exact: true }).click();
        await expect(owner.getByRole("heading", { name: "Revision 3 · Current when loaded", exact: true })).toBeVisible();
        const xml = await downloadXml(owner, "Export revision 3 DOCX");
        console.log("STEP immutable history restore and DOCX download passed");
        for (const marker of ["DRAFT — NOT APPROVED", "Original connected advice", "Ontario synthetic contract", "Synthetic facts only", source!.current_version_id, source!.content_sha256, "Opening paragraph"]) expect(xml).toContain(marker);
        expect(xml).not.toContain("Revised connected advice.");
        const base = `/api/projects/${fixture.matterId}/work-products/${saved.work_product.id}`;
        expect((await owner.request.get(`/api/projects/${fixture.foreignMatterId}`)).status()).toBe(404);
        const foreignDocumentResponse = await owner.request.get(`/api/single-documents/${fixture.foreignSourceId}`);
        expect(foreignDocumentResponse.status()).toBe(200);
        const foreignDocument = await foreignDocumentResponse.json();
        expect(foreignDocument.project_id).not.toBe(fixture.matterId);
        const foreign = await owner.request.post(`/api/projects/${fixture.matterId}/work-products`, { data: { request_id: crypto.randomUUID(), expected_version_id: null, title: "Rejected foreign source", body: "Never save", scope: "", assumptions: "", sources: [{ document_id: fixture.foreignSourceId, version_id: foreignDocument.current_version_id, content_sha256: foreignDocument.content_sha256 }] } });
        expect(foreign.status()).toBe(409);
        await signIn(viewer, fixture.viewer);
        console.log("STEP independent viewer signed in");
        await viewer.goto(`/projects/${fixture.matterId}/drafts`);
        await viewer.getByRole("button", { name: /^Connected advice/ }).click();
        await expect(viewer.getByLabel("Draft text", { exact: true })).toHaveAttribute("readonly", "");
        await expect(viewer.getByRole("button", { name: "New draft", exact: true })).toHaveCount(0);
        await expect(viewer.getByRole("button", { name: "Save revision", exact: true })).toHaveCount(0);
        expect(await downloadXml(viewer, "Export revision 3 DOCX")).toContain("Original connected advice");
        const history = await (await viewer.request.get(`${base}/versions`)).json();
        expect(history.versions.map((item: { revision: number }) => item.revision)).toEqual([3, 2, 1]);
        const deniedWrite = await viewer.request.post(`${base}/versions`, { data: { request_id: crypto.randomUUID(), expected_version_id: history.current_version_id, title: "Denied", body: "Denied", scope: "", assumptions: "", sources: [] } });
        expect(deniedWrite.status()).toBe(403);
        expect(await deniedWrite.json()).toMatchObject({ detail: expect.stringMatching(/editor/i) });
        expect((await viewer.request.get(`/api/projects/${fixture.foreignMatterId}`)).status()).toBe(200); // Viewer owns firm B.
        const foreignDenied = await viewer.request.get(`/api/single-documents/${fixture.foreignSourceId}`);
        expect(foreignDenied.status()).toBe(403);
        expect(await foreignDenied.json()).toEqual({ detail: "You do not have access to this document." });
        const issued = await (await viewer.request.get(`/api/single-documents/${source!.id}/url`)).json();
        const beforeRevocation = await fetch(issued.url); // No recipient cookies or Authorization.
        expect(beforeRevocation.status).toBe(200);
        expect(beforeRevocation.headers.get("cache-control")).toBe("private, no-store");
        await beforeRevocation.arrayBuffer();
        const token = new URL(issued.url).pathname.split("/").at(-1)!;
        const capability = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
        expect(capability.e - Math.floor(Date.now() / 1000)).toBeLessThanOrEqual(3600);
        expect(capability.e - Math.floor(Date.now() / 1000)).toBeGreaterThan(3500);
        expect((await owner.request.delete(`/api/projects/${fixture.matterId}/access/${encodeURIComponent(fixture.viewer.email)}`)).ok()).toBe(true);
        for (const resource of [`/api/projects/${fixture.matterId}`, base, `${base}/versions`, `${base}/versions/${saved.version.id}`, `/api/single-documents/${source!.id}/url`]) expect((await viewer.request.get(resource)).status()).toBe(404);
        expect((await viewer.request.get(`/api/single-documents/${source!.id}`)).status()).toBe(403);
        expect((await viewer.request.post(`${base}/versions/${history.current_version_id}/export`)).status()).toBe(404);
        // The original URL must be re-authorized, without minting another link.
        const revokedLink = await fetch(issued.url);
        expect(revokedLink.status).toBe(404);
        expect(revokedLink.headers.get("cache-control")).toBe("private, no-store");
        expect((await owner.request.get(issued.url)).status()).toBe(404);
        const ownerLink = await (await owner.request.get(`/api/single-documents/${source!.id}/url`)).json();
        expect((await owner.request.get(ownerLink.url)).status()).toBe(200);
        console.log("STEP revoked requests and issued-link revocation verified");
        await viewer.reload();
        await expect(viewer.getByText("Matter unavailable. Return to Matters to choose an accessible matter.", { exact: true })).toBeVisible();
        await expect(viewer.getByLabel("Draft text", { exact: true })).toHaveCount(0);
        expect(pageErrors).toEqual([]);
    } finally { await ownerContext.close(); await viewerContext.close(); }
});
