import Link from "next/link";
import { pillButtonUIClassName } from "@northwrit/ui";

export default function AdvancedSettingsPage() {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-medium">Advanced</h2>
            <p className="text-sm text-gray-600">Open the IDE to work with files and development tools.</p>
            <Link href="/ide" className={pillButtonUIClassName({ tone: "white" })}>Open IDE</Link>
        </section>
    );
}
