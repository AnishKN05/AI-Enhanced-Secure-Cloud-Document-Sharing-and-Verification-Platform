import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

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
        <nav>
          <Link href="/" className="logo">
            <ShieldCheck size={32} color="#0070f3" />
            SecureDoc
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Home</Link>
            <Link href="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Dashboard</Link>
            <Link href="/verify" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Verify Portal</Link>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
          </div>
        </nav>
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
