import { Document, Paragraph, TextRun, HeadingLevel, Packer, Header, Footer } from "docx";
import type { WorkProductVersion } from "@northwrit/contracts";

/** Render a manual draft, never an approved legal deliverable. No external requests. */
export async function renderDraftDocx(matter: { id: string; name: string }, version: WorkProductVersion): Promise<Buffer> {
    const warning = "DRAFT — NOT APPROVED";
    const safeLabel = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu, "\uFFFD");
    const lines = (text: string) => (text || "Not specified").split(/\r?\n/).map(line => new Paragraph({ children: [new TextRun(line)] }));
    const heading = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_1 });
    const document = new Document({
        creator: safeLabel(version.author_label), title: version.title,
        description: `${warning}; work product ${version.work_product_id}; version ${version.id}`,
        sections: [{
            headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: warning, bold: true })] })] }) },
            footers: { default: new Footer({ children: [new Paragraph(`NorthWrit draft · Revision ${version.revision} · ${version.id}`)] }) },
            children: [new Paragraph({ text: warning, heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: version.title, heading: HeadingLevel.TITLE }),
                new Paragraph(`Matter: ${safeLabel(matter.name)} (${matter.id})`),
                new Paragraph(`Revision ${version.revision} · ${safeLabel(version.author_label)} · ${version.created_at}`),
                new Paragraph(`Work product: ${version.work_product_id} · Version: ${version.id}`),
                heading("Draft"), ...lines(version.body), heading("Scope"), ...lines(version.scope),
                heading("Assumptions"), ...lines(version.assumptions), heading("Source references"),
                ...(version.sources.length ? version.sources.flatMap((source, index) => [
                    new Paragraph(`[${index + 1}] ${safeLabel(source.filename)} · Version ${source.version_number ?? "unspecified"}`),
                    new Paragraph(`Document ${source.document_id} · Version ${source.version_id}`),
                    new Paragraph(`SHA-256 ${source.content_sha256}`),
                    ...lines(source.locator || "No passage locator supplied"),
                ]) : [new Paragraph("No sources attached.")]),
                heading("Limitations"), new Paragraph("Source references are user-selected. Claim support, current law and legal correctness have not been verified. This draft has not received work-product approval and must be reviewed before external use."),
            ],
        }],
    });
    return Packer.toBuffer(document);
}
