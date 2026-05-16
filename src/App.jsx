import React, { useRef, useEffect } from 'react';
import './styles/global.css';
import { useChat } from './hooks/useChat';
import Header from './components/Header';
import TaskPillBar from './components/TaskPillBar';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';

const IS_LIVE = Boolean(process.env.REACT_APP_ANTHROPIC_API_KEY);

export default function App() {
  const { 
    messages, loading, activeTask, send, 
    datasetProfile, setDatasetProfile,
    expertise, setExpertise,
    domain, setDomain,
    dataType, setDataType
  } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll whenever messages update or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // When a pill is clicked, send a canned query for that task
  const handlePillClick = (task) => {
    send(
      `Give me a detailed ${task.label} workflow with top algorithms, ` +
      `evaluation metrics, preprocessing steps, and ready-to-run Python code.`
    );
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
    }}>
      <Header 
        activeTask={activeTask} 
        isLive={IS_LIVE} 
        expertise={expertise}
        setExpertise={setExpertise}
        domain={domain}
        setDomain={setDomain}
      />
      <TaskPillBar
        activeTaskId={activeTask?.id}
        onSelect={handlePillClick}
      />
      <MessageList
        messages={messages}
        loading={loading}
        bottomRef={bottomRef}
      />
      <InputBar 
        onSend={send} 
        loading={loading} 
        datasetProfile={datasetProfile}
        setDatasetProfile={setDatasetProfile}
        dataType={dataType}
        setDataType={setDataType}
      />
    </div>
  );
}
