'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser, logout, AuthUser } from '@/lib/authStore';
import { useRouter, usePathname } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<AuthUser | null>(null);

    const checkAuth = useCallback(() => {
        setUser(getCurrentUser());
    }, []);

    // Re-check auth on every route change
    useEffect(() => {
        checkAuth();
    }, [pathname, checkAuth]);

    // Also listen for storage events (e.g. login from another tab)
    useEffect(() => {
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [checkAuth]);

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push('/');
    };

    return (
        <nav>
            <Link href="/" className="logo">
                <ShieldCheck size={32} color="#0070f3" />
                SecureDoc
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Home</Link>
                <Link href="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Dashboard</Link>
                <Link href="/verify" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Verify Portal</Link>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.9rem', borderRadius: '50px',
                            background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.2)',
                            fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)'
                        }}>
                            <User size={14} />
                            {user.name.split(' ')[0]}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                background: 'transparent', border: '1px solid var(--border)',
                                color: '#888', padding: '0.4rem 0.9rem', borderRadius: '8px',
                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/auth" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Get Started
                    </Link>
                )}
            </div>
        </nav>
    );
}
