import { describe, expect, it } from "vitest";
import { citationReminder } from "../tools/documentOps";
import { parseCitationsWithDiagnostics } from "../citations";
import { verifyDocumentCitationAnnotation } from "../verifyCitations";

describe("document tool citation format contract", () => {
  it.each(["contract.docx", "table.xlsx"])("provides a complete parseable citation block for %s", filename => {
    const reminder = citationReminder("doc-1", filename, "fenced filename");
    const parsed = parseCitationsWithDiagnostics(reminder);
    expect(parsed.diagnostics.error).toBeNull();
    expect(parsed.diagnostics.hasBlock).toBe(true);
    expect(parsed.citations).toHaveLength(1);
    expect(parsed.citations[0]).toMatchObject({ kind: "document", ref: 1, doc_id: "doc-1" });
    if (filename.endsWith("xlsx")) expect(parsed.citations[0]).toMatchObject({ sheet: "Sheet name", cell: "B7" });
  });

  it("accepts a complete citation array after the observed heading", () => {
    const entry = { ref: 1, doc_id: "doc-1", quotes: [{ page: 1, quote: "47 calendar days" }] };
    const answer = `The period is 47 days [1].\n[Citations]\n${JSON.stringify([entry])}`;
    expect(parseCitationsWithDiagnostics(answer).citations).toHaveLength(1);
    expect(parseCitationsWithDiagnostics(JSON.stringify([entry])).citations).toEqual([]);
    expect(parseCitationsWithDiagnostics(answer + " trailing prose").citations).toEqual([]);
    expect(parseCitationsWithDiagnostics(answer.slice(0, -1)).citations).toEqual([]);
  });

  it("keeps model-supplied quotes subject to source verification", async () => {
    const annotation = { doc_id: "doc-1", quote: "The notice period is 99 days.", page: 1 };
    const checked = await verifyDocumentCitationAnnotation(annotation, async () => "The notice period is 47 days.");
    expect(checked).toMatchObject({ verified: false });
  });
});
