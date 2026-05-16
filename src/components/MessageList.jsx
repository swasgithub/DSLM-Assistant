import React from 'react';
import { C } from '../styles/theme';
import ResponseCard from './ResponseCard';

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 30, height: 30, borderRadius: 10, flexShrink: 0,
        background: `${C.accent}20`, border: `1px solid ${C.accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: C.accent,
        boxShadow: `0 0 12px ${C.accent}40`,
        textShadow: `0 0 5px ${C.accent}80`,
      }}>AI</div>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: '4px 12px 12px 12px', padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: C.textMuted,
              animation: `bounce 1.4s ${delay}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MessageList({ messages, loading, bottomRef }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {messages.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: C.textMuted, paddingTop: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🧠</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Data Science Workflow Assistant
          </div>
          <div style={{ fontSize: 13, maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
            Describe your ML problem or click a task pill above.
            DSLM will recommend algorithms, metrics, preprocessing steps,
            and generate ready-to-run Python code.
          </div>
        </div>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-start', // In row-reverse, flex-start is right
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            marginLeft: msg.role === 'user' ? 'auto' : '0',
            gap: 12, alignItems: 'flex-start',
            animation: 'fadeUp 0.3s ease',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 30, height: 30, borderRadius: 10, flexShrink: 0, marginTop: 2,
            background: msg.role === 'ai' ? `${C.accent}20` : `${C.purple}20`,
            border: `1px solid ${msg.role === 'ai' ? C.accent : C.purple}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, 
            color: msg.role === 'ai' ? C.accent : C.purple,
            boxShadow: msg.role === 'ai' 
              ? `0 0 12px ${C.accent}40` 
              : `0 0 12px ${C.purple}40`,
            textShadow: msg.role === 'ai' 
              ? `0 0 5px ${C.accent}80` 
              : `0 0 5px ${C.purple}80`,
          }}>
            {msg.role === 'ai' ? 'AI' : 'U'}
          </div>

          {/* Message Bubble */}
          <div style={{
            maxWidth: msg.role === 'user' ? '75%' : '90%',
            width: 'fit-content',
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: msg.role === 'user'
              ? '16px 4px 16px 16px'
              : '4px 16px 16px 16px',
            padding: '12px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
            wordBreak: 'break-word',
            transition: 'all 0.3s ease',
          }}>
            <ResponseCard data={msg.data} />
          </div>
        </div>
      ))}

      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
