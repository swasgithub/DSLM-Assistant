import React, { useState, useRef } from 'react';
import { C } from '../styles/theme';
import { profileDataset, profileToContextString } from '../utils/profiler';

const QUICK_PROMPTS = [
  'Predict house prices from features',
  'Classify customer churn',
  'Cluster user segments',
  'Forecast monthly sales',
  'Detect anomalies in logs',
  'Recommend products to users',
];

export default function InputBar({ onSend, loading, datasetProfile, setDatasetProfile, dataType, setDataType }) {
  const [text, setText] = useState('');
  const [profiling, setProfiling] = useState(false);
  const taRef = useRef(null);
  const fileRef = useRef(null);

  const DATA_TYPES = [
    { id: 'tabular', label: 'Tabular', icon: '📊' },
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'timeseries', label: 'Time-Series', icon: '📅' },
    { id: 'multimodal', label: 'Multi-Modal', icon: '🧩' },
  ];

  const submit = () => {
    if (!text.trim() || loading || profiling) return;
    onSend(text.trim());
    setText('');
    if (taRef.current) { taRef.current.style.height = 'auto'; }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const onInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfiling(true);
    try {
      const profile = await profileDataset(file);
      const profileStr = profileToContextString(profile);
      setDatasetProfile(profileStr);
      if (profile.guessedType) {
        setDataType(profile.guessedType);
      }
    } catch (err) {
      console.error('Profiling error:', err);
      alert('Failed to profile dataset. Please use CSV, JSON or Excel.');
    } finally {
      setProfiling(false);
    }
  };

  return (
    <div style={{
      padding: '10px 16px 14px',
      background: C.panel,
      borderTop: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      {/* Data Type Chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
        {DATA_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setDataType(type.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 6,
              border: `1px solid ${dataType === type.id ? C.accent : C.border}`,
              background: dataType === type.id ? `${C.accent}15` : 'transparent',
              color: dataType === type.id ? C.accent : C.textMuted,
              fontSize: 10, fontWeight: 600, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 0.5,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            <span>{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {/* File Status & Clear */}
      {datasetProfile && (
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: `${C.accent}10`, border: `1px solid ${C.accent}30`,
          borderRadius: 6, padding: '4px 10px', marginBottom: 10,
          animation: 'fadeUp 0.2s ease'
        }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📁 Dataset Attached:</span>
            <span style={{ color: C.text, fontWeight: 400 }}>
              {datasetProfile.split('\n')[1].replace('File: ', '')}
            </span>
          </div>
          <button 
            onClick={() => { setDatasetProfile(null); if (fileRef.current) fileRef.current.value = ''; }}
            style={{ 
              background: 'transparent', border: 'none', color: C.textMuted, 
              cursor: 'pointer', fontSize: 14, padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map(q => (
          <button
            key={q}
            onClick={() => onSend(q)}
            disabled={loading || profiling}
            style={{
              padding: '4px 10px', borderRadius: 20,
              border: `1px solid ${C.border}`,
              background: 'transparent', color: C.textMuted,
              fontSize: 11, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              opacity: (loading || profiling) ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!loading && !profiling) {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.color = C.accent;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textMuted;
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Text input + send */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <input 
          type="file" 
          ref={fileRef} 
          style={{ display: 'none' }} 
          accept=".csv,.json,.xlsx,.xls"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={loading || profiling}
          style={{
            width: 38, height: 38, borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: profiling ? `${C.accent}20` : C.card,
            color: profiling ? C.accent : C.textMuted,
            fontSize: 18,
            cursor: (loading || profiling) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}
          title="Upload dataset (CSV, JSON, Excel)"
        >
          {profiling ? '⏳' : '📎'}
        </button>

        <textarea
          ref={taRef}
          value={text}
          onChange={onInput}
          onKeyDown={onKey}
          rows={1}
          placeholder={profiling ? "Analyzing dataset..." : "Describe your ML problem…"}
          disabled={loading || profiling}
          style={{
            flex: 1,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '9px 12px',
            color: C.text, fontSize: 13,
            fontFamily: 'inherit', resize: 'none',
            minHeight: 40, maxHeight: 110,
            lineHeight: 1.55, outline: 'none',
            transition: 'border-color 0.2s',
            opacity: (loading || profiling) ? 0.7 : 1,
          }}
          onFocus={e => { e.target.style.borderColor = C.accent; }}
          onBlur={e  => { e.target.style.borderColor = C.border; }}
        />
        <button
          onClick={submit}
          disabled={loading || profiling || !text.trim()}
          style={{
            width: 38, height: 38, borderRadius: 8,
            border: 'none',
            background: (loading || profiling || !text.trim()) ? C.border : C.accent,
            color: '#000', fontSize: 15,
            cursor: (loading || profiling || !text.trim()) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳' : '▶'}
        </button>
      </div>
    </div>
  );
}
