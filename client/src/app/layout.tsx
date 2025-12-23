import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export const metadata: Metadata = {
    title: "CashFlow",
    description:
        "Track your spending effortlessly with our easy-to-use expense tracker. Manage budgets, monitor expenses, and save smarter every day!"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <NextTopLoader color="var(--primary)" showSpinner={false} />
                <ReactQueryProvider>{children}</ReactQueryProvider>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
