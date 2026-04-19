'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { signUp, login } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'signup') {
                if (form.password !== form.confirmPassword) {
                    setError('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
                if (form.password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    setIsLoading(false);
                    return;
                }
                const result = await signUp(form.name, form.email, form.password);
                if (!result.success) {
                    setError(result.error || 'Sign up failed.');
                    setIsLoading(false);
                    return;
                }
            } else {
                const result = await login(form.email, form.password);
                if (!result.success) {
                    setError(result.error || 'Login failed.');
                    setIsLoading(false);
                    return;
                }
            }
            // Success - redirect to dashboard
            router.push('/dashboard');
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        outline: 'none',
    };

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '480px' }}>
            <div className="hero-gradient" />

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(0,112,243,0.2), rgba(0,255,136,0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', border: '1px solid rgba(0,112,243,0.3)'
                    }}
                >
                    <ShieldCheck size={36} color="var(--accent)" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}
                >
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </motion.h1>
                <p style={{ color: '#888', fontSize: '1rem' }}>
                    {mode === 'login'
                        ? 'Sign in to access your secure workspace.'
                        : 'Join the AI-enhanced document security platform.'}
                </p>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {/* Mode Toggle */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => { setMode('login'); setError(''); }}
                        style={{
                            flex: 1, padding: '1.25rem', border: 'none',
                            background: mode === 'login' ? 'var(--glass)' : 'transparent',
                            color: mode === 'login' ? 'white' : '#666',
                            cursor: 'pointer', fontWeight: 700, transition: '0.3s', fontSize: '0.95rem',
                            borderBottom: mode === 'login' ? '2px solid var(--accent)' : '2px solid transparent'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setMode('signup'); setError(''); }}
                        style={{
                            flex: 1, padding: '1.25rem', border: 'none',
                            background: mode === 'signup' ? 'var(--glass)' : 'transparent',
                            color: mode === 'signup' ? 'white' : '#666',
                            cursor: 'pointer', fontWeight: 700, transition: '0.3s', fontSize: '0.95rem',
                            borderBottom: mode === 'signup' ? '2px solid var(--accent)' : '2px solid transparent'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Name field (signup only) */}
                                {mode === 'signup' && (
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,112,243,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                )}

                                {/* Email */}
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,112,243,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                {/* Password */}
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        required
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,112,243,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
                                    </button>
                                </div>

                                {/* Confirm Password (signup only) */}
                                {mode === 'signup' && (
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            required
                                            value={form.confirmPassword}
                                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                            style={inputStyle}
                                            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,112,243,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            marginTop: '1.25rem', padding: '0.85rem 1rem',
                                            background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
                                            borderRadius: '10px', color: 'var(--error)', fontSize: '0.9rem', fontWeight: 500
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                    width: '100%', marginTop: '1.75rem', padding: '1rem',
                                    fontSize: '1.05rem', justifyContent: 'center',
                                    opacity: isLoading ? 0.7 : 1,
                                    background: 'linear-gradient(135deg, var(--accent), #0055cc)',
                                }}
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Features hint */}
                            {mode === 'signup' && (
                                <div style={{
                                    marginTop: '2rem', padding: '1.25rem',
                                    background: 'rgba(0,112,243,0.05)', borderRadius: '12px',
                                    border: '1px solid rgba(0,112,243,0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 700 }}>
                                        <Sparkles size={14} />
                                        What you get
                                    </div>
                                    <ul style={{ fontSize: '0.85rem', color: '#888', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>✓ AI-powered document verification</li>
                                        <li>✓ SHA-256 integrity hashing</li>
                                        <li>✓ Shareable secure links</li>
                                        <li>✓ AES-256 encryption</li>
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
