import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import type { WorkProductVersion } from "@northwrit/contracts";
import { renderDraftDocx } from "../workProducts.docx";

const version: WorkProductVersion = {
    id: "version-1", work_product_id: "draft-1", revision: 3, based_on_version_id: null, title: "Draft <scope>",
    body: "First & second\nNew paragraph", scope: "Synthetic scope", assumptions: "Assumption only",
    created_by: "actor", author_label: "Author", created_at: "2026-11-17T00:00:00Z",
    sources: [{ document_id: "source-1", version_id: "source-version-1", content_sha256: "a".repeat(64), filename: "Agreement.docx", version_number: 2, locator: "Clause 4" }],
};
describe("draft DOCX", () => {
    it("marks the selected revision as unapproved and retains exact provenance and user text", async () => {
        const bytes = await renderDraftDocx({ id: "matter-1", name: "Matter" }, version);
        const zip = await JSZip.loadAsync(bytes);
        const xml = await zip.file("word/document.xml")!.async("string");
        for (const text of ["DRAFT — NOT APPROVED", "Revision 3", "version-1", "matter-1", "Synthetic scope", "Assumption only", "source-version-1", "Agreement.docx", "Clause 4", "a".repeat(64), "have not been verified"])
            expect(xml).toContain(text);
        expect(xml).toContain("Draft &lt;scope&gt;");
        expect(xml).toContain("First &amp; second");
        expect(await zip.file("word/header1.xml")!.async("string")).toContain("DRAFT — NOT APPROVED");
        expect(await zip.file("docProps/core.xml")!.async("string")).toContain("Author");
    });
    it("discloses empty sources, scope and assumptions", async () => {
        const zip = await JSZip.loadAsync(await renderDraftDocx({ id: "m", name: "Matter" }, { ...version, sources: [], scope: "", assumptions: "" }));
        const xml = await zip.file("word/document.xml")!.async("string");
        expect(xml).toContain("No sources attached.");expect(xml).toContain("Not specified");
    });
});
