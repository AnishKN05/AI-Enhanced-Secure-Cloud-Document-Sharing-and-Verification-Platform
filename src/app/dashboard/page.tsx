'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, FileText, CheckCircle, AlertCircle,
    Loader2, Share2, Shield, Eye, Clock, Hash, FileCheck, Zap
} from 'lucide-react';
import { generateHash, encryptDocument, analyzeDocument } from '@/lib/crypto';
import { useRouter } from 'next/navigation';

interface Document {
    id: string;
    name: string;
    size: string;
    type: string;
    hash: string;
    status: 'authentic' | 'suspicious';
    date: string;
    preview?: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [steps, setSteps] = useState<{ label: string, status: 'pending' | 'loading' | 'complete' | 'error' }[]>([
        { label: 'Reading Document Data & Metadata', status: 'pending' },
        { label: 'Generating SHA-256 integrity Hash', status: 'pending' },
        { label: 'AES-256 Client-Side Encryption', status: 'pending' },
        { label: 'AI Visual & Digital Signature Scan', status: 'pending' }
    ]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [analysisReport, setAnalysisReport] = useState<{ status: string, report: string[] } | null>(null);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const readPreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                resolve(content.substring(0, 150) + '...');
            };
            reader.readAsText(file.slice(0, 500));
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setAnalysisReport(null);
        const newSteps = [...steps].map(s => ({ ...s, status: 'pending' as const }));
        setSteps(newSteps);

        try {
            // Step 0: Reading
            newSteps[0].status = 'loading';
            setSteps([...newSteps]);
            const preview = file.type.includes('text') ? await readPreview(file) : 'Binary data secured.';
            await new Promise(r => setTimeout(r, 600)); // Sim reading
            newSteps[0].status = 'complete';
            setSteps([...newSteps]);

            // Step 1: Hashing
            newSteps[1].status = 'loading';
            setSteps([...newSteps]);
            const hash = await generateHash(file);
            newSteps[1].status = 'complete';
            setSteps([...newSteps]);

            // Step 2: Encryption
            newSteps[2].status = 'loading';
            setSteps([...newSteps]);
            await encryptDocument(file);
            newSteps[2].status = 'complete';
            setSteps([...newSteps]);

            // Step 3: AI Analysis
            newSteps[3].status = 'loading';
            setSteps([...newSteps]);
            const analysis = await analyzeDocument(file);
            newSteps[3].status = 'complete';
            setSteps([...newSteps]);

            setAnalysisReport({ status: analysis.status, report: analysis.report });

            const newDoc: Document = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: formatSize(file.size),
                type: file.type || 'Unknown Type',
                hash: hash,
                status: analysis.status === 'authentic' ? 'authentic' : 'suspicious',
                date: new Date().toLocaleDateString(),
                preview: preview
            };

            setDocuments([newDoc, ...documents]);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("An error occurred during document processing. Check the console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Secure Workspace</h1>
                    <p style={{ color: '#888' }}>Total Documents: {documents.length} | Protected by AES-256</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <Zap size={14} color="var(--success)" />
                        AI Online
                    </div>
                    <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <Shield size={14} color="var(--accent)" />
                        Node: Secure-01
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Upload Area */}
                    <section className="glass-card" style={{
                        textAlign: 'center',
                        borderStyle: 'dashed',
                        borderColor: isUploading ? 'var(--accent)' : 'var(--glass-border)',
                        background: isUploading ? 'rgba(0,112,243,0.05)' : 'var(--glass)',
                        padding: '3rem'
                    }}>
                        <input
                            type="file"
                            id="file-upload"
                            hidden
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <label htmlFor="file-upload" style={{ cursor: isUploading ? 'not-allowed' : 'pointer', display: 'block' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                {isUploading ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <Loader2 className="animate-spin" size={64} color="#0070f3" style={{ margin: '0 auto' }} />
                                    </motion.div>
                                ) : (
                                    <Upload size={64} color="#0070f3" style={{ margin: '0 auto' }} />
                                )}
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                                {isUploading ? 'Securing Asset...' : 'Upload & Verify Document'}
                            </h2>
                            <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto' }}>
                                Drop your files here to initiate the AI-enhanced cryptographic verification pipeline.
                            </p>
                        </label>

                        <AnimatePresence>
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ marginTop: '2.5rem', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}
                                >
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Pipeline Status</h4>
                                    {steps.map((step, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', opacity: step.status === 'pending' ? 0.3 : 1 }}>
                                            {step.status === 'loading' ? <Loader2 className="animate-spin" size={18} color="var(--accent)" /> :
                                                step.status === 'complete' ? <CheckCircle size={18} color="var(--success)" /> :
                                                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #444' }} />}
                                            <span style={{ fontSize: '0.95rem', fontWeight: step.status === 'loading' ? 600 : 400 }}>{step.label}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* Document List */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Secure Explorer</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {documents.length === 0 ? (
                                <div style={{ padding: '8rem', textAlign: 'center', color: '#666', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                    <Shield size={48} style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                                    <p style={{ fontSize: '1.1rem' }}>No documents under protection.</p>
                                    <p style={{ fontSize: '0.9rem', color: '#444' }}>Upload a file to begin the verification process.</p>
                                </div>
                            ) : (
                                documents.map((doc) => (
                                    <motion.div
                                        key={doc.id}
                                        className="glass-card"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px' }}>
                                                    <FileText size={32} color={doc.status === 'authentic' ? 'var(--success)' : 'var(--error)'} />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{doc.name}</h3>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#666', fontSize: '0.8rem' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {doc.date}</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Hash size={12} /> {doc.hash.substring(0, 12)}...</span>
                                                        <span>{doc.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--border)' }}
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/verify?hash=${doc.hash}`;
                                                        navigator.clipboard.writeText(url);
                                                        alert('Secure verification link copied!');
                                                    }}
                                                >
                                                    <Share2 size={16} />
                                                    Share Link
                                                </button>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                                                    onClick={() => router.push(`/verify?hash=${doc.hash}`)}
                                                >
                                                    <FileCheck size={16} />
                                                    Verify Portal
                                                </button>
                                            </div>
                                        </div>
                                        {doc.preview && (
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#888', fontStyle: 'italic', borderLeft: '3px solid var(--accent)' }}>
                                                "{doc.preview}"
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Side Panel */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} color="var(--success)" />
                            Security Protocol
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.4rem' }}>Document Analysis</p>
                                <p>AI models scan for visual inconsistencies, metadata tampering, and signature validity.</p>
                            </div>
                            <div style={{ padding: '1.25rem', background: 'rgba(0,112,243,0.08)', borderRadius: '12px', border: '1px solid rgba(0,112,243,0.2)' }}>
                                <p style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '0.4rem' }}>Active Protection</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                    <span>Hashing</span>
                                    <span style={{ color: 'var(--success)' }}>SHA-256</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                    <span>Encryption</span>
                                    <span style={{ color: 'var(--success)' }}>AES-256</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {analysisReport && (
                            <motion.div
                                className="glass-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{ borderColor: analysisReport.status === 'authentic' ? 'var(--success)' : 'var(--error)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Audit Results</h3>
                                    <div style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        background: analysisReport.status === 'authentic' ? 'rgba(0,255,136,0.15)' : 'rgba(255,77,77,0.15)',
                                        color: analysisReport.status === 'authentic' ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {analysisReport.status.toUpperCase()}
                                    </div>
                                </div>
                                <ul style={{ fontSize: '0.85rem', color: '#ccc', listStyle: 'none' }}>
                                    {analysisReport.report.map((item, i) => (
                                        <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.75rem', lineHeight: 1.4 }}>
                                            <CheckCircle size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: analysisReport.status === 'authentic' ? 'var(--success)' : 'var(--error)' }} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>
            </div>
        </div>
    );
}
