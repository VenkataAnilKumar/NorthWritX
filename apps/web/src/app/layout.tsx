import type { Metadata } from "next";
// Self-hosted Inter and EB Garamond; sets --font-inter and --font-eb-garamond.
import "./fonts/fonts.css";
import "./globals.css";
import { Providers } from "@/app/components/providers";

export const metadata: Metadata = {
    metadataBase: process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL) : undefined,
    title: "NorthWrit | Canadian Legal AI Workspace",
    description:
        "AI-powered legal document analysis and contract review platform.",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        url: "/",
        siteName: "NorthWrit",
        title: "NorthWrit | Canadian Legal AI Workspace",
        description:
            "AI-powered legal document analysis and contract review platform.",
        images: [
            {
                url: "/northwrit-social.jpg",
                width: 1200,
                height: 630,
                alt: "NorthWrit",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "NorthWrit | Canadian Legal AI Workspace",
        description:
            "AI-powered legal document analysis and contract review platform.",
        images: ["/northwrit-social.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className="font-sans antialiased"
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
