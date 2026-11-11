"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { FieldLabel } from "@/app/components/ui/form-field";
import { SUPPORT_EMAIL } from "@mike/client";

const fieldClassName = "w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2";

export default function SupportPage() {
    const router = useRouter();
    const { isAuthenticated, authLoading } = useAuth();
    const [draft, setDraft] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.replace("/");
    }, [authLoading, isAuthenticated, router]);

    function prepareDraft(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const subject = String(form.get("subject") ?? "").trim();
        const message = String(form.get("message") ?? "").trim();
        const link = String(form.get("link") ?? "").trim();
        if (!subject || !message) return;
        const body = link ? `${message}\n\nRelated link: ${link}` : message;
        setDraft(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    if (authLoading || !isAuthenticated) return null;

    return (
        <main className="mx-auto w-full max-w-xl space-y-5 px-5 py-8">
            <h1 className="text-2xl font-semibold">NorthWrit support</h1>
            <p className="text-muted-foreground">
                Prepare a draft in your email app. Review it before sending.
                {!SUPPORT_EMAIL && " Ask your workspace administrator for the support address."}
            </p>
            <form onSubmit={prepareDraft} onChange={() => setDraft(null)} className="space-y-4">
                <div>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <input id="subject" name="subject" required maxLength={150} className={fieldClassName} />
                </div>
                <div>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <textarea id="message" name="message" required maxLength={1800} rows={5} className={fieldClassName} />
                </div>
                <div>
                    <FieldLabel htmlFor="link">Related link (optional)</FieldLabel>
                    <input id="link" name="link" type="url" placeholder="https://..." maxLength={500} className={fieldClassName} />
                </div>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground focus-visible:outline-2">
                    Prepare email
                </button>
            </form>
            {draft && (
                <a href={draft} className="inline-block rounded underline focus-visible:outline-2">
                    Open email draft
                </a>
            )}
        </main>
    );
}
