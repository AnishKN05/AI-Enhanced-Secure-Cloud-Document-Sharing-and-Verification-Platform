'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ShieldCheck, FileText, Hash, Clock, CheckCircle,
    AlertTriangle, Copy, Eye, Download, Upload, RefreshCw
} from 'lucide-react';
import { getDocumentById, updateDocumentFileData, StoredDocument } from '@/lib/documentStore';
import Link from 'next/link';

export default function SharePage() {
    const params = useParams();
    const id = params.id as string;
    const [doc, setDoc] = useState<StoredDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (id) {
            const found = getDocumentById(id);
            setDoc(found);
            setLoading(false);
        }
    }, [id]);

    const handleCopyLink = async () => {
        const url = window.location.href;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999px';
                textArea.style.top = '-999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy this share link:', url);
        }
    };

    const handleDownload = async () => {
        if (!doc?.fileData) return;
        setDownloading(true);

        try {
            // Convert data URL to Blob for reliable cross-browser download
            const byteString = atob(doc.fileData.split(',')[1]);
            const mimeType = doc.fileData.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = doc.name;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 200);
        } catch (err) {
            console.error('Download failed:', err);
            // Fallback: open data URL directly
            const win = window.open(doc.fileData, '_blank');
            if (!win) alert('Download blocked by browser. Please allow popups.');
        } finally {
            setDownloading(false);
        }
    };

    // Allow re-uploading file content for documents that were created before fileData was stored
    const handleReUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !doc) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            updateDocumentFileData(doc.id, dataUrl);
            setDoc({ ...doc, fileData: dataUrl });
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    style={{ display: 'inline-block' }}
                >
                    <ShieldCheck size={48} color="var(--accent)" />
                </motion.div>
                <p style={{ marginTop: '1rem', color: '#888' }}>Loading shared document...</p>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', maxWidth: '600px' }}>
                <div className="hero-gradient" />
                <div className="glass-card" style={{ padding: '4rem 3rem' }}>
                    <AlertTriangle size={64} color="var(--error)" style={{ margin: '0 auto 2rem', display: 'block' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Document Not Found</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        This shared link is invalid or the document has been removed from the origin device.
                    </p>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthentic = doc.status === 'authentic';
    const isImage = doc.type?.startsWith('image/');
    const isText = doc.type?.includes('text') || doc.name?.endsWith('.txt') || doc.name?.endsWith('.csv');
    const isPDF = doc.type === 'application/pdf';
    const hasFileData = !!doc.fileData;

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
            <div className="hero-gradient" />

            {/* Header Badge */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: isAuthentic ? 'rgba(0,255,136,0.08)' : 'rgba(255,77,77,0.08)',
                        padding: '0.6rem 1.25rem', borderRadius: '50px',
                        color: isAuthentic ? 'var(--success)' : 'var(--error)',
                        marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700,
                        border: `1px solid ${isAuthentic ? 'rgba(0,255,136,0.2)' : 'rgba(255,77,77,0.2)'}`
                    }}
                >
                    {isAuthentic ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {isAuthentic ? 'Verified Document' : 'Suspicious Document'}
                </motion.div>
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
                    Shared Secure Document
                </h1>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>
                    This document has been shared via SecureDoc&apos;s encrypted verification pipeline.
                </p>
            </div>

            {/* Document Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="glass-card" style={{
                    padding: '2.5rem',
                    borderColor: isAuthentic ? 'rgba(0,255,136,0.3)' : 'rgba(255,77,77,0.3)',
                    background: isAuthentic ? 'rgba(0,255,136,0.02)' : 'rgba(255,77,77,0.02)'
                }}>
                    {/* File Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '70px', height: '70px', borderRadius: '16px',
                            background: 'rgba(255,255,255,0.05)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border)'
                        }}>
                            <FileText size={32} color={isAuthentic ? 'var(--success)' : 'var(--error)'} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{doc.name}</h2>
                            <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontSize: '0.85rem' }}>
                                <span>{doc.type}</span>
                                <span>{doc.size}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={12} /> {doc.date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* File Preview - shown when fileData exists */}
                    {hasFileData && (
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                Document Preview
                            </p>
                            <div style={{
                                background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden',
                                border: '1px solid var(--border)'
                            }}>
                                {isImage ? (
                                    <img
                                        src={doc.fileData}
                                        alt={doc.name}
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
                                    />
                                ) : isPDF ? (
                                    <iframe
                                        src={doc.fileData}
                                        style={{ width: '100%', height: '500px', border: 'none' }}
                                        title={doc.name}
                                    />
                                ) : isText && doc.preview ? (
                                    <div style={{ padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#ccc', whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto' }}>
                                        {doc.preview}
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                        <FileText size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
                                        <p>Preview not available for this file type.</p>
                                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Click download to view the full document.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hash */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                            SHA-256 Integrity Hash
                        </p>
                        <div style={{
                            fontFamily: 'monospace', fontSize: '0.9rem', color: '#aaa',
                            wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '1rem',
                            borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            <Hash size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{doc.hash}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '1.25rem', borderRadius: '12px',
                        background: isAuthentic ? 'rgba(0,255,136,0.08)' : 'rgba(255,77,77,0.08)',
                        border: `1px solid ${isAuthentic ? 'rgba(0,255,136,0.2)' : 'rgba(255,77,77,0.2)'}`,
                        marginBottom: '2rem'
                    }}>
                        {isAuthentic ? <CheckCircle size={24} color="var(--success)" /> : <AlertTriangle size={24} color="var(--error)" />}
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: isAuthentic ? 'var(--success)' : 'var(--error)' }}>
                                {isAuthentic ? 'Document Integrity Verified' : 'Document Flagged as Suspicious'}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#888' }}>
                                {isAuthentic
                                    ? 'This document passed all AI security checks and hash verification.'
                                    : 'This document may have been tampered with. Proceed with caution.'}
                            </p>
                        </div>
                    </div>

                    {/* No file data notice with re-upload option */}
                    {!hasFileData && (
                        <div style={{
                            marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px',
                            background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
                            textAlign: 'center'
                        }}>
                            <Upload size={28} color="orange" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                            <p style={{ fontWeight: 700, color: 'orange', marginBottom: '0.5rem' }}>
                                File Content Not Available
                            </p>
                            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                This document was uploaded before the download feature was enabled. The document owner can attach the file content below.
                            </p>
                            <input type="file" id="reupload" hidden onChange={handleReUpload} />
                            <label htmlFor="reupload" className="btn-primary" style={{
                                display: 'inline-flex', padding: '0.75rem 1.5rem', cursor: 'pointer',
                                background: 'rgba(255,165,0,0.2)', border: '1px solid rgba(255,165,0,0.4)'
                            }}>
                                <RefreshCw size={16} />
                                Attach File for Download
                            </label>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {hasFileData && (
                            <button
                                className="btn-primary"
                                onClick={handleDownload}
                                disabled={downloading}
                                style={{
                                    flex: 1, justifyContent: 'center', padding: '1rem',
                                    background: 'linear-gradient(135deg, var(--accent), #0055cc)',
                                    opacity: downloading ? 0.7 : 1
                                }}
                            >
                                <Download size={18} />
                                {downloading ? 'Preparing...' : 'Download Document'}
                            </button>
                        )}
                        <Link
                            href={`/verify?hash=${doc.hash}`}
                            className="btn-primary"
                            style={{
                                flex: 1, justifyContent: 'center', padding: '1rem',
                                background: hasFileData ? 'transparent' : 'var(--accent)',
                                border: hasFileData ? '1px solid var(--border)' : 'none'
                            }}
                        >
                            <Eye size={18} />
                            Verify on Portal
                        </Link>
                        <button
                            className="btn-primary"
                            onClick={handleCopyLink}
                            style={{
                                flex: 1, justifyContent: 'center', padding: '1rem',
                                background: 'transparent', border: '1px solid var(--border)'
                            }}
                        >
                            {copied ? <CheckCircle size={18} color="var(--success)" /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Security Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    marginTop: '2rem', textAlign: 'center', padding: '1.5rem',
                    color: '#666', fontSize: '0.85rem',
                    background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                    border: '1px solid var(--border)'
                }}
            >
                <ShieldCheck size={16} style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                <p>Secured by <strong style={{ color: 'var(--accent)' }}>SecureDoc AI</strong> — End-to-End Encrypted Verification</p>
            </motion.div>
        </div>
    );
}
