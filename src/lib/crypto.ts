/**
 * Generates a SHA-256 hash of a File object.
 */
export async function generateHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Simulates document encryption.
 * In a real app, this would use a key and return an encrypted Blob.
 */
export async function encryptDocument(file: File): Promise<{ encryptedBlob: Blob; key: string }> {
    // Simulating a minor delay for encryption
    await new Promise(resolve => setTimeout(resolve, 800));

    const key = Math.random().toString(36).substring(2, 15);
    // Just returning the original file as a blob for simulation
    return { encryptedBlob: file, key };
}

/**
 * AI Analysis Simulator
 */
export async function analyzeDocument(file: File): Promise<{
    score: number;
    status: 'authentic' | 'suspicious' | 'tampered';
    report: string[];
}> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Deterministic simulation based on file name/size for demo consistency
    const seed = file.name.length + file.size;
    const isSuspicious = seed % 10 === 0; // 10% chance of suspicion

    if (isSuspicious) {
        return {
            score: 45,
            status: 'suspicious',
            report: [
                "Visual artifacts detected in signature area.",
                "Metadata mismatch found in header.",
                "Font consistency check failed on page 1."
            ]
        };
    }

    return {
        score: 98,
        status: 'authentic',
        report: [
            "Digital signature matches original header.",
            "Pixel consistency check passed.",
            "No anomalies detected in document layout.",
            "Metadata confirms original generation source."
        ]
    };
}
