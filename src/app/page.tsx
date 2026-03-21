'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Cpu, Share2, CheckCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Lock size={24} color="#0070f3" />,
      title: "End-to-End Encryption",
      description: "Documents are encrypted locally before being stored, ensuring only authorized users can ever view the raw content."
    },
    {
      icon: <Cpu size={24} color="#0070f3" />,
      title: "AI Analysis",
      description: "Advanced AI models scan documents for visual inconsistencies and digital tampering to ensure absolute authenticity."
    },
    {
      icon: <CheckCircle size={24} color="#0070f3" />,
      title: "Cryptographic Integrity",
      description: "Every document is hashed with SHA-256. Any minor modification will result in a completely different hash value."
    },
    {
      icon: <Share2 size={24} color="#0070f3" />,
      title: "Secure Verification Links",
      description: "Share verifiable links with third parties. Recipients can verify the document's authenticity in seconds."
    }
  ];

  return (
    <div className="container">
      <div className="hero-gradient" />

      <section style={{
        padding: '8rem 0 4rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'linear-gradient(to bottom, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Secure Document Sharing <br /> Reinvented with AI
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#888',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
          }}>
            Encryption, Cryptographic Hashing, and AI-Powered Verification.
            The most secure way to share and verify sensitive documents.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary">
              <ShieldCheck size={20} />
              Go to Dashboard
            </a>
            <a href="/verify" style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'white',
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Verify a Document
            </a>
          </div>
        </motion.div>
      </section>

      <section style={{ padding: '6rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: '#888', fontSize: '0.95rem' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{
        padding: '6rem 0',
        textAlign: 'center',
        borderTop: '1px solid var(--border)'
      }}>
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Ready to Secure Your Documents?</h2>
          <p style={{ color: '#888', marginBottom: '2rem' }}>
            Join thousands of businesses ensuring document integrity with SecureDoc's AI-enhanced platform.
          </p>
          <a href="/dashboard" className="btn-primary">
            Start Sharing Securely
          </a>
        </div>
      </section>
    </div>
  );
}
