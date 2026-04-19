import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import NavBar from "./NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureDoc | AI-Enhanced Verifiable Document Sharing",
  description: "Securely upload, share and verify documents using AI-based forgery detection and cryptographic hashing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="page-container">
          {children}
        </main>
        <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
          &copy; 2026 SecureDoc AI Platform. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
