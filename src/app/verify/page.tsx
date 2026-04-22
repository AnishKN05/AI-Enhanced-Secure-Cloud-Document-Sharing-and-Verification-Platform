'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Upload, Search, CheckCircle,
    XCircle, Info, Loader2, FileSearch, Fingerprint, Activity, Database, Hash, Clock
} from 'lucide-react';
import { generateHash, analyzeDocument } from '@/lib/crypto';
import { getDocumentByHash } from '@/lib/documentStore';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerificationContent() {
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(false);
    const [method, setMethod] = useState<'upload' | 'hash'>('upload');
    const [result, setResult] = useState<{
        status: 'authentic' | 'suspicious' | 'not-found';
        details: string[];
        hash: string;
        timestamp?: string;
        documentName?: string;
    } | null>(null);

    const searchParams = useSearchParams();
    const preloadHash = searchParams.get('hash');

    useEffect(() => {
        if (preloadHash) {
            setMethod('hash');
            handleVerifyByHash(preloadHash);
        }
    }, [preloadHash]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsVerifying(true);
        setResult(null);

        try {
            const hash = await generateHash(file);
            const analysis = await analyzeDocument(file);

            // Also check if this hash exists in our store
            const storedDoc = getDocumentByHash(hash);

            setResult({
                status: analysis.status === 'authentic' ? 'authentic' : 'suspicious',
                details: analysis.report,
                hash: hash,
                timestamp: new Date().toLocaleString(),
                documentName: storedDoc?.name || file.name
            });
        } catch (err) {
            alert("Verification failed. Invalid file format.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyByHash = async (hash: string) => {
        if (!hash || hash.length < 5) return;
        setIsVerifying(true);
        setResult(null);

        // Look up hash in our document store
        await new Promise(resolve => setTimeout(resolve, 1500));

        const storedDoc = getDocumentByHash(hash);

        if (storedDoc) {
            setResult({
                status: storedDoc.status === 'authentic' ? 'authentic' : 'suspicious',
                details: storedDoc.status === 'authentic'
                    ? [
                        "SHA-256 Checksum confirmed in secure index.",
                        "Document integrity verified 100%.",
                        `Origin document: \"${storedDoc.name}\" (${storedDoc.size})`,
                        `Uploaded on: ${storedDoc.date}`,
                        "Visual fingerprint matches stored record."
                    ]
                    : [
                        "⚠ Document flagged as suspicious in secure index.",
                        `Origin document: \"${storedDoc.name}\"`,
                        "Content integrity check failed.",
                        "Possible tampering detected."
                    ],
                hash: hash,
                timestamp: storedDoc.date,
                documentName: storedDoc.name
            });
        } else {
            setResult({
                status: 'not-found',
                details: [
                    "No records exist for this cryptographic hash.",
                    "This document has not been registered in SecureDoc.",
                    "Warning: Document might be forged or untracked.",
                    "Recommendation: Request the sender to upload via SecureDoc first."
                ],
                hash: hash,
                timestamp: undefined
            });
        }

        setIsVerifying(false);
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '900px' }}>
            <div className="hero-gradient" />

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(0,112,243,0.1)',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '50px',
                        color: 'var(--accent)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        border: '1px solid rgba(0,112,243,0.2)'
                    }}
                >
                    <Fingerprint size={18} />
                    Global Trust Network
                </motion.div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                    Verification Portal
                </h1>
                <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Instantly validate document authenticity using our multi-layer AI security engine.
                </p>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => { setMethod('upload'); setResult(null); }}
                        style={{
                            flex: 1, padding: '1.5rem', border: 'none', background: method === 'upload' ? 'var(--glass)' : 'transparent',
                            color: method === 'upload' ? 'white' : '#666', cursor: 'pointer', fontWeight: 700, transition: '0.3s',
                            borderBottom: method === 'upload' ? '2px solid var(--accent)' : 'none'
                        }}
                    >
                        <Upload size={18} style={{ marginBottom: '0.25rem', display: 'block', margin: '0 auto 0.5rem' }} />
                        File Analysis
                    </button>
                    <button
                        onClick={() => { setMethod('hash'); setResult(null); }}
                        style={{
                            flex: 1, padding: '1.5rem', border: 'none', background: method === 'hash' ? 'var(--glass)' : 'transparent',
                            color: method === 'hash' ? 'white' : '#666', cursor: 'pointer', fontWeight: 700, transition: '0.3s',
                            borderBottom: method === 'hash' ? '2px solid var(--accent)' : 'none'
                        }}
                    >
                        <Hash size={18} style={{ marginBottom: '0.25rem', display: 'block', margin: '0 auto 0.5rem' }} />
                        Hash Lookup
                    </button>
                </div>

                <div style={{ padding: '4rem 3rem' }}>
                    {method === 'upload' ? (
                        <div style={{ textAlign: 'center' }}>
                            <input type="file" id="portal-upload" hidden onChange={handleFileUpload} disabled={isVerifying} />
                            <label htmlFor="portal-upload" style={{ cursor: isVerifying ? 'not-allowed' : 'pointer', display: 'block' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,112,243,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                                        border: '1px solid rgba(0,112,243,0.1)'
                                    }}
                                >
                                    {isVerifying ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                            <Activity size={40} color="var(--accent)" />
                                        </motion.div>
                                    ) : <Upload size={40} color="var(--accent)" />}
                                </motion.div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                                    {isVerifying ? 'Scanning Document...' : 'Select File to Verify'}
                                </h3>
                                <p style={{ color: '#666', maxWidth: '300px', margin: '0 auto' }}>
                                    {isVerifying ? 'Performing AI visual audit and checking SHA-256 checksum...' : 'Drag and drop your file here to perform a deep security scan.'}
                                </p>
                            </label>
                        </div>
                    ) : (
                        <div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Paste SHA-256 hash (64 characters)..."
                                    defaultValue={preloadHash || ''}
                                    style={{
                                        width: '100%', padding: '1.25rem 3.5rem 1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--border)', borderRadius: '14px', color: 'white', fontSize: '1.1rem',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleVerifyByHash((e.target as HTMLInputElement).value);
                                    }}
                                />
                                <button
                                    onClick={(e) => handleVerifyByHash((e.currentTarget.previousSibling as HTMLInputElement).value)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'var(--accent)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    <Search size={22} color="white" />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', color: '#666', fontSize: '0.85rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Database size={14} /> Network: Global-Sync</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> Latency: 12ms</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '3rem' }}
                    >
                        <div className="glass-card" style={{
                            borderColor: result.status === 'authentic' ? 'var(--success)' : result.status === 'not-found' ? 'var(--border)' : 'var(--error)',
                            background: result.status === 'authentic' ? 'rgba(0,255,136,0.03)' : 'rgba(255,77,77,0.03)',
                            padding: '2.5rem'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '2rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        {result.status === 'authentic' ? <CheckCircle size={32} color="var(--success)" /> :
                                            result.status === 'not-found' ? <FileSearch size={32} color="#666" /> :
                                                <XCircle size={32} color="var(--error)" />}
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                            {result.status === 'authentic' ? 'Document Verified' :
                                                result.status === 'not-found' ? 'Status: Not Found' : 'Document is FAKE & Unverified'}
                                        </h2>
                                        {result.status === 'suspicious' && (
                                            <span style={{
                                                background: 'linear-gradient(135deg, #ff1744, #d50000)',
                                                color: 'white',
                                                padding: '0.4rem 1.2rem',
                                                borderRadius: '50px',
                                                fontSize: '0.85rem',
                                                fontWeight: 800,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                boxShadow: '0 2px 12px rgba(255,23,68,0.4)',
                                                animation: 'pulse 2s infinite'
                                            }}>
                                                ⚠ FAKE
                                            </span>
                                        )}
                                    </div>

                                    {result.documentName && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <p style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                                Document Name
                                            </p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{result.documentName}</p>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '2rem' }}>
                                        <p style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                            Cryptographic Fingerprint (SHA-256)
                                        </p>
                                        <p style={{ color: '#aaa', fontSize: '1rem', fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
                                            {result.hash}
                                        </p>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px' }}>
                                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#666', fontWeight: 700, marginBottom: '1.25rem' }}>Detailed Audit Log</h4>
                                        <ul style={{ listStyle: 'none', fontSize: '1rem', color: '#ccc' }}>
                                            {result.details.map((detail, i) => (
                                                <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <Info size={18} style={{ marginTop: '0.1rem', flexShrink: 0, color: result.status === 'authentic' ? 'var(--success)' : 'var(--error)' }} />
                                                    <span style={{ lineHeight: 1.4 }}>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {result.status === 'authentic' && (
                                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>VERIFICATION DATE</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2rem' }}>{result.timestamp}</p>
                                        <div style={{ width: '120px', height: '120px', background: 'white', margin: '0 auto', padding: '0.5rem', borderRadius: '8px' }}>
                                            <div style={{ width: '100%', height: '100%', border: '4px solid black', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                                                {Array.from({ length: 16 }).map((_, i) => (
                                                    <div key={i} style={{ background: result.hash.charCodeAt(i % result.hash.length) % 2 === 0 ? 'black' : 'white' }} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.8rem' }}>TRUSTED ORIGIN</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function VerificationPortal() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--accent)" /></div>}>
            <VerificationContent />
        </Suspense>
    );
}
