'use client';

export interface StoredDocument {
    id: string;
    userId?: string;
    name: string;
    size: string;
    type: string;
    hash: string;
    contentHash: string;
    status: 'authentic' | 'suspicious';
    date: string;
    preview?: string;
    fileData?: string; // base64 data URL for file download
}

const STORAGE_KEY = 'securedoc_documents';

function getDocuments(): StoredDocument[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function setDocuments(docs: StoredDocument[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function saveDocument(doc: StoredDocument): void {
    const docs = getDocuments();
    // Avoid duplicates by id
    const existing = docs.findIndex(d => d.id === doc.id);
    if (existing >= 0) {
        docs[existing] = doc;
    } else {
        docs.unshift(doc);
    }
    setDocuments(docs);
}

export function getDocumentById(id: string): StoredDocument | null {
    const docs = getDocuments();
    return docs.find(d => d.id === id) || null;
}

export function getDocumentByHash(hash: string): StoredDocument | null {
    const docs = getDocuments();
    return docs.find(d => d.hash === hash) || null;
}

export function getAllDocuments(userId?: string): StoredDocument[] {
    const docs = getDocuments();
    if (userId) {
        return docs.filter(d => d.userId === userId);
    }
    return docs;
}

export function updateDocumentFileData(id: string, fileData: string): void {
    const docs = getDocuments();
    const doc = docs.find(d => d.id === id);
    if (doc) {
        doc.fileData = fileData;
        setDocuments(docs);
    }
}

export function generateDocId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
