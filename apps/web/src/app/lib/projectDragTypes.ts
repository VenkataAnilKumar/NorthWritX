type DragTypes = Pick<DataTransfer, "types">;

export function isDocumentViewerDrag(dataTransfer: DragTypes): boolean {
    return (
        isExternalFileDrag(dataTransfer) ||
        dataTransfer.types.includes("application/northwrit-doc") ||
        dataTransfer.types.includes("application/northwrit-docs")
    );
}

export function isProjectItemDrag({ types }: DragTypes): boolean {
    return (
        types.includes("application/northwrit-doc") ||
        types.includes("application/northwrit-folder")
    );
}

export function isExternalFileDrag({ types }: DragTypes): boolean {
    return types.includes("Files");
}

export function isChatAttachmentDrag(dataTransfer: DragTypes): boolean {
    return (
        isExternalFileDrag(dataTransfer) ||
        dataTransfer.types.includes("application/northwrit-doc")
    );
}
