"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryDestination, SECTION_LINKS, sectionIsActive } from "@/app/lib/navigation";
import { LIQUID_GLASS_HOVER_CLASS, LIQUID_GLASS_SELECTED_CLASS } from "@/app/components/ui/liquid-surface";
import { cn } from "@/app/lib/utils";

export function WorkspaceSectionNav() {
    const pathname = usePathname();
    const destination = primaryDestination(pathname);
    if (destination !== "/library" && destination !== "/workflows") return null;
    return (
        <nav aria-label={destination === "/library" ? "Library sections" : "Workflow sections"}
            className="flex shrink-0 gap-1 overflow-x-auto px-4 py-2 md:px-6">
            {SECTION_LINKS[destination].map(({ href, label }) => (
                <Link key={href} href={href} aria-current={sectionIsActive(pathname, href) ? "page" : undefined}
                    className={cn("shrink-0 rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40", sectionIsActive(pathname, href) ? LIQUID_GLASS_SELECTED_CLASS : LIQUID_GLASS_HOVER_CLASS)}>
                    {label}
                </Link>
            ))}
        </nav>
    );
}
