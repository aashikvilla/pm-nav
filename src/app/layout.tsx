import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AuthSessionProvider } from "@/components/session-provider";
import { PageLoader } from "@/components/ui/page-loader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loomis — The Honest Path to PM",
  description: "The methodical, architectural strategy to break into Product Management through genuine skill and clinical preparation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-surface)] text-[var(--color-on-surface)]">
        <AuthSessionProvider>
          <Suspense>
            <PageLoader />
          </Suspense>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
