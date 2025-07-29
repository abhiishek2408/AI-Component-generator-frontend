import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditorPage() {
  const { sessionId } = useParams();
  const token = localStorage.getItem('token');

  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [jsxCode, setJsxCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeTab, setActiveTab] = useState('jsx');


  const sendPrompt = async () => {
  if (!input.trim()) return;

  const userPrompt = input;
  setInput('');

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-component-generator-frontend-mocha.vercel.app',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You generate clean React JSX and CSS based on prompts. Do not explain.',
          },
          {
            role: 'user',
            content: `Prompt: ${userPrompt}

Respond ONLY with a strict JSON object:
{
  "jsx": "<JSX code>",
  "css": "<CSS code>"
}

No markdown, no \\\\, no explanations — JSON only.`,
          },
        ],
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    let parsed;
    try {
      const jsonMatch = reply.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error('No valid JSON in reply');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('AI raw reply:', reply);
      alert('AI did not return valid JSON. Try a simpler prompt or switch models.');
      return;
    }

const newChat = [
  ...chat,
  { role: 'user', text: userPrompt },
  { role: 'assistant', text: 'Component generated!' },
];

const cleanChat = newChat.filter(
  (msg) => msg?.role && msg?.text
);

setChat(cleanChat);
setJsxCode(parsed.jsx);
setCssCode(parsed.css);


saveSession(cleanChat, parsed.jsx, parsed.css);

  } catch (error) {
    console.error('AI Error:', error);
    alert('Failed to connect to AI model');
  }
};


  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        alert('Login required.');
        return;
      }

      try {
        const res = await axios.get(`https://ai-component-generator-backend-0e8d.onrender.com/api/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChat(res.data.chatHistory || []);
        setJsxCode(res.data.code?.jsx || '');
        setCssCode(res.data.code?.css || '');
      } catch (err) {
        console.error('Session Load Error:', err);
        alert('Failed to load session data');
      }
    };

    if (sessionId && token) {
      loadSession();
    }
  }, [sessionId, token]);

  const downloadZip = () => {
    const zipContent = `// Component.jsx\n${jsxCode}\n\n// style.css\n${cssCode}`;
    const blob = new Blob([zipContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `session-${sessionId}.zip`;
    link.click();
  };


  const saveSession = async (chatHistory, jsx, css) => {
  try {
    await axios.put(
      `https://ai-component-generator-backend-0e8d.onrender.com/api/session/${sessionId}`,
      {
        chatHistory,
        code: { jsx, css },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Session saved to DB.");
  } catch (err) {
    console.error("Failed to save session to DB:", err);
  }
};


  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', fontFamily: 'Arial' }}>
      <div style={{ width: '25%', borderRight: '1px solid #eee', padding: '1rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem', color: '#6a0dad' }}>Chats</h3>
        <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>{chat.map((msg, i) => (<p key={i} style={{ color: msg.role === 'user' ? '#6a0dad' : '#4ade80', marginBottom: '0.5rem' }}>
          <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}</p>))}</div></div><div style={{ width: '50%', padding: '2rem 2rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
          <div style={{ flex: 1 }}><h3 style={{ color: '#6a0dad', marginBottom: '1rem' }}>Live Preview</h3><iframe title="LivePreview" style={{ width: '100%', height: '70vh', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '8px' }} srcDoc={`<style>${cssCode}</style>${jsxCode}`} />
          </div>

    <div style={{ display: 'flex', marginTop: '1rem', gap: '0.5rem' }}>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1, padding: '0.6rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }} />
      <button onClick={sendPrompt} style={{ padding: '0.6rem 1rem', backgroundColor: '#6a0dad', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
      </div>
      </div>

      <div style={{ width: '25%', padding: '1rem', borderLeft: '1px solid #eee', backgroundColor: '#fafafa' }}>
        <h3 style={{ color: '#6a0dad', marginBottom: '1rem' }}>Code Editor</h3>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setActiveTab('jsx')} style={{ padding: '0.5rem', marginRight: '0.5rem', backgroundColor: activeTab === 'jsx' ? '#6a0dad' : '#e0e0e0', color: activeTab === 'jsx' ? '#fff' : '#333', border: 'none', borderRadius: '5px' }}>JSX</button>
          <button onClick={() => setActiveTab('css')} style={{ padding: '0.5rem', backgroundColor: activeTab === 'css' ? '#6a0dad' : '#e0e0e0', color: activeTab === 'css' ? '#fff' : '#333', border: 'none', borderRadius: '5px' }}>CSS</button>
          </div>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '1rem', height: '300px', overflow: 'auto', color: '#333', borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>{activeTab === 'jsx' ? jsxCode : cssCode}</pre>
          <div style={{ marginTop: '1rem' }}><button onClick={() => navigator.clipboard.writeText(activeTab === 'jsx' ? jsxCode : cssCode)} style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', marginRight: '0.5rem' }}>Copy</button>
          <button onClick={downloadZip} style={{ padding: '0.5rem 1rem', backgroundColor: '#6a0dad', color: 'white', border: 'none', borderRadius: '5px' }}>Download ZIP</button>
          </div>
          </div>
          </div>
  );
}

export default EditorPage;
