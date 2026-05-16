import React from 'react';
import { C } from '../styles/theme';

export default function Header({ activeTask, isLive, expertise, setExpertise, domain, setDomain }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 18px',
      background: C.panel,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${C.accent}18`,
          border: `1px solid ${C.accent}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🧠</div>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>
          <span style={{ color: C.accent }}>DSLM</span> Assistant
        </span>
      </div>

      {/* Active task badge */}
      {activeTask && (
        <div style={{
          padding: '3px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 500,
          background: `${activeTask.color}18`,
          color: activeTask.color,
          border: `1px solid ${activeTask.color}35`,
          transition: 'all 0.3s',
        }}>
          {activeTask.icon} {activeTask.label}
        </div>
      )}

      {/* Expertise selector */}
      <div style={{
        display: 'flex', background: C.card,
        border: `1px solid ${C.border}`, borderRadius: 8,
        padding: 2, marginLeft: 12,
      }}>
        {['beginner', 'pro', 'expert'].map(level => (
          <button
            key={level}
            onClick={() => setExpertise(level)}
            style={{
              padding: '4px 12px', borderRadius: 6,
              border: 'none', fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: 0.5,
              cursor: 'pointer', transition: 'all 0.2s',
              background: expertise === level ? C.accent : 'transparent',
              color: expertise === level ? '#000' : C.textMuted,
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Domain selector */}
      <div style={{ marginLeft: 8 }}>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            background: C.card, color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '4px 8px', fontSize: 11, fontWeight: 500,
            outline: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="generic">🌍 Generic</option>
          <option value="healthcare">🏥 Healthcare</option>
          <option value="finance">💰 Finance</option>
          <option value="nlp">🔤 NLP</option>
          <option value="ecommerce">🛒 E-commerce</option>
        </select>
      </div>

    </div>
  );
}
