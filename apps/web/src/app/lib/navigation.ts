/** Visible navigation groups; stored IDs and existing URLs stay unchanged. */
export function primaryDestination(pathname: string): string | null {
    const root = pathname.split("/")[1];
    if (root === "assistant" || root === "history") return "/assistant";
    if (root === "projects") return "/projects";
    if (root === "library" || root === "playbooks") return "/library";
    if (root === "workflows" || root === "tabular-reviews") return "/workflows";
    if (root === "settings" || root === "ide") return "/settings";
    return null;
}

export const SECTION_LINKS = {
    "/library": [
        { href: "/library", label: "Files" },
        { href: "/library/templates", label: "Templates" },
        { href: "/playbooks", label: "Playbooks" },
    ],
    "/workflows": [
        { href: "/workflows", label: "Saved workflows" },
        { href: "/tabular-reviews", label: "Reviews" },
    ],
} as const;

export function sectionIsActive(pathname: string, href: string): boolean {
    if (href === "/library") {
        return pathname === href || pathname.startsWith("/library/files") || pathname.startsWith("/library/folders/");
    }
    return pathname === href || pathname.startsWith(href + "/");
}
