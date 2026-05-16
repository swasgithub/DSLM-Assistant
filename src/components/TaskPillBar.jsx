import React from 'react';
import { TASK_TYPES } from '../data/taskTypes';
import { C } from '../styles/theme';

export default function TaskPillBar({ activeTaskId, onSelect }) {
  return (
    <div 
      style={{
        display: 'flex', gap: 10, padding: '12px 18px',
        flexWrap: 'wrap', justifyContent: 'center',
        background: C.panel,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}
    >
      {TASK_TYPES.map(task => {
        const active = task.id === activeTaskId;
        return (
          <button
            key={task.id}
            onClick={() => onSelect(task)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 12,
              border: `1px solid ${active ? task.color : C.border}`,
              background: active ? `${task.color}12` : C.card,
              color: active ? task.color : C.text,
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'inherit',
              boxShadow: active ? `0 4px 12px ${task.color}25` : 'none',
              transform: active ? 'translateY(-1px)' : 'none',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.borderColor = task.color;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            <span style={{ fontSize: 16 }}>{task.icon}</span>
            {task.label}
          </button>
        );
      })}
    </div>
  );
}
