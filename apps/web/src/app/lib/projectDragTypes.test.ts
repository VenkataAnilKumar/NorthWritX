import { describe, expect, it } from "vitest";
import {
    isChatAttachmentDrag,
    isExternalFileDrag,
    isDocumentViewerDrag,
    isProjectItemDrag,
} from "./projectDragTypes";

describe("project drag types", () => {
    it.each([
        [["Files"], true],
        [["application/northwrit-doc"], true],
        [["application/northwrit-docs"], true],
        [["application/northwrit-folder"], false],
        [["application/northwrit-project-tab"], false],
        [["text/plain"], false],
    ])("recognizes viewer drops %j", (types, accepted) => {
        expect(isDocumentViewerDrag({ types: types as string[] })).toBe(
            accepted,
        );
    });
    it.each([
        [[], false, false, false],
        [["text/plain"], false, false, false],
        [["Files"], true, true, false],
        [["application/northwrit-doc"], true, false, true],
        [["application/northwrit-folder"], false, false, true],
        [["application/northwrit-doc", "Files"], true, true, true],
    ])("recognizes %j", (types, attachment, files, projectItem) => {
        const transfer = { types: types as string[] };
        expect(isChatAttachmentDrag(transfer)).toBe(attachment);
        expect(isExternalFileDrag(transfer)).toBe(files);
        expect(isProjectItemDrag(transfer)).toBe(projectItem);
    });
});
