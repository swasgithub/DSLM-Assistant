import { useState, useCallback } from 'react';
import { detectTask } from '../data/taskTypes';
import { buildFallback } from '../data/fallbackResponses';
import { useAnthropicAPI } from './useAnthropicAPI';

export function useChat() {
  const [messages,   setMessages]   = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [datasetProfile, setDatasetProfile] = useState(null);
  const [expertise, setExpertise] = useState('pro');
  const [domain, setDomain] = useState('generic');
  const [dataType, setDataType] = useState('tabular');
  const { query, loading } = useAnthropicAPI();

  const send = useCallback(async (text, profileOverride = null) => {
    if (!text?.trim() || loading) return;

    const profile = profileOverride || datasetProfile;

    // 1. Detect task type from keywords (check both user text and dataset profile)
    const detected = detectTask(text) || (profile ? detectTask(profile) : null);
    if (detected) setActiveTask(detected);

    // 2. Append user message immediately (optimistic UI)
    const newUserMsg = { id: Date.now(), role: 'user', data: { rawText: text } };
    setMessages(prev => [...prev, newUserMsg]);

    // 3. Call AI — fall back to static library on any error
    try {
      let extraContext = `USER EXPERTISE LEVEL: ${expertise.toUpperCase()}\n`;
      extraContext += `DOMAIN CONTEXT: ${domain.toUpperCase()}\n`;
      extraContext += `DATA TYPE: ${dataType.toUpperCase()}\n`;
      if (detected) extraContext += `The user's problem is likely: ${detected.label}. `;
      if (profile) {
        extraContext += `\n\n${profile}`;
      }

      // Format history for Anthropic API
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.data.rawText || ''
      }));
      history.push({ role: 'user', content: text });

      const reply = await query(history, extraContext);

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', data: { rawText: reply } },
      ]);
    } catch {
      // Graceful degradation — structured fallback response
      const taskId   = detected?.id;
      const fallback = taskId ? buildFallback(taskId) : null;

      setMessages(prev => [
        ...prev,
        {
          id:   Date.now() + 1,
          role: 'ai',
          data: {
            ...(fallback || {}),
            rawText: !fallback ? `⚠️ API Connection Issue. I've analyzed your data traits below, but I need a live connection to answer specific questions about your columns. Please check your API key.` : undefined,
            profileSummary: profile, // Pass the profile to the UI
          },
        },
      ]);
    }
  }, [loading, query, expertise, domain, dataType, datasetProfile, messages]);

  return { 
    messages, loading, activeTask, send, 
    datasetProfile, setDatasetProfile,
    expertise, setExpertise,
    domain, setDomain,
    dataType, setDataType
  };
}
