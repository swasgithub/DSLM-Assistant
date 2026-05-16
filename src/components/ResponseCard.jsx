import React, { useState, useEffect } from 'react';
import { C } from '../styles/theme';
import { boldMarkdown } from '../utils/formatHelpers';

/* ── Score bar ─────────────────────────────────────────────── */
function ScoreBar({ score, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 120);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{
        flex: 1, height: 3, background: C.border,
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          width: `${width}%`, height: '100%',
          background: color, borderRadius: 2,
          transition: 'width 0.9s ease',
        }} />
      </div>
      <span style={{ fontSize: 10, color: C.textMuted, minWidth: 28 }}>{score}%</span>
    </div>
  );
}

function AlgorithmCard({ algo, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: C.dim,
      border: `1px solid ${C.border}`,
      borderRadius: 8, padding: 10,
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.3s ease',
      height: 'fit-content',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>
        {algo.name}
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
        {algo.metric}
      </div>
      <ScoreBar score={algo.score} color={color} />
      <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, marginTop: 4 }}>
        {algo.note}
      </div>

      <button
        onClick={() => setOpen(!open)}
        style={{
          marginTop: 8, padding: '4px 0',
          background: 'transparent', border: 'none',
          color: C.accent, fontSize: 10, fontWeight: 600,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 4,
          outline: 'none',
        }}
      >
        {open ? '↓ Hide Details' : '→ Why this model?'}
      </button>

      {open && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: `1px dashed ${C.border}`,
          animation: 'fadeUp 0.2s ease',
        }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: C.textMuted, marginBottom: 2, letterSpacing: 0.5 }}>Why?</div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>{algo.why || 'Matches problem traits and data distributions.'}</div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: C.textMuted, marginBottom: 2, letterSpacing: 0.5 }}>Failure Case</div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>{algo.failure || 'Poor performance if data is extremely sparse.'}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: C.textMuted, marginBottom: 2, letterSpacing: 0.5 }}>What to Tune</div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>{algo.tune || 'n_estimators, max_depth'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Copy-to-clipboard code block ───────────────────────────── */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginTop: 14 }}>
      {/* top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#050810',
        border: `1px solid ${C.border}`,
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        padding: '6px 12px',
      }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'monospace' }}>Python</span>
        <button
          onClick={copy}
          style={{
            padding: '3px 9px', borderRadius: 4,
            border: `1px solid ${copied ? C.green : C.border}`,
            background: 'transparent',
            color: copied ? C.green : C.textMuted,
            fontSize: 11, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {/* code body */}
      <pre style={{
        background: '#050810',
        border: `1px solid ${C.border}`,
        borderRadius: '0 0 8px 8px',
        padding: '12px 14px',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 11, color: '#8BB8D4',
        overflowX: 'auto', whiteSpace: 'pre',
        lineHeight: 1.7, margin: 0,
      }}>
        {code}
      </pre>
    </div>
  );
}

/* ── Raw AI text card ────────────────────────────────────────── */
function RawCard({ text }) {
  return (
    <div
      style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
      dangerouslySetInnerHTML={{ __html: boldMarkdown(text) }}
    />
  );
}

/* ── Structured fallback card ───────────────────────────────── */
function StructuredCard({ data }) {
  const tag = (label) => (
    <span key={label} style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: 20, margin: '2px 3px',
      fontSize: 11, background: C.border, color: C.text,
    }}>
      {label}
    </span>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          display: 'inline-block', padding: '2px 9px',
          borderRadius: 20, marginBottom: 6,
          fontSize: 10, fontWeight: 600,
          background: `${data.color}18`,
          color: data.color,
          border: `1px solid ${data.color}30`,
        }}>
          {data.badge}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{data.title}</div>
        <div style={{ fontSize: 12, color: C.textMuted, fontStyle: 'italic', lineHeight: 1.6 }}>
          💡 {data.insight}
        </div>
      </div>

      {/* Algorithm grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, marginBottom: 14,
      }}>
        {data.algorithms.map(algo => (
          <AlgorithmCard key={algo.name} algo={algo} color={data.color} />
        ))}
      </div>

      {/* Metrics + Preprocessing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{
          background: C.dim, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 7, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Metrics
          </div>
          <div>{data.metrics.map(tag)}</div>
        </div>
        <div style={{
          background: C.dim, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 7, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Preprocessing
          </div>
          <div>{data.preprocessing.map(tag)}</div>
        </div>
      </div>

      {/* Code block */}
      <CodeBlock code={data.code} />
    </div>
  );
}

/* ── Public component ───────────────────────────────────────── */
export default function ResponseCard({ data }) {
  if (!data) return null;

  const showProfile = data.profileSummary;

  return (
    <div>
      {data.rawText && <RawCard text={data.rawText} />}
      {(!data.rawText && data.algorithms) && <StructuredCard data={data} />}

      {showProfile && (
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: `1px solid ${C.border}`,
          animation: 'fadeUp 0.3s ease',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: C.accent,
            textTransform: 'uppercase', letterSpacing: 0.8,
            marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span>📊</span> Data Profile Context
          </div>
          <pre style={{
            fontSize: 11, color: C.textMuted,
            background: `${C.panel}80`, padding: 10,
            borderRadius: 6, border: `1px solid ${C.border}`,
            whiteSpace: 'pre-wrap', lineHeight: 1.6,
            fontFamily: 'monospace', margin: 0,
          }}>
            {data.profileSummary}
          </pre>
        </div>
      )}
    </div>
  );
}
