import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function DashboardEditor() {
  const [sessions, setSessions] = useState([]);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [jsxCode, setJsxCode] = useState('');
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/session/my-sessions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data);
      } catch (err) {
        alert('Failed to load sessions');
      }
    };

    fetchSessions();
  }, [token]);


  const createSession = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/session/create', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      alert('Failed to create session');
    }
  };


  useEffect(() => {
    const loadChat = async () => {
      if (!sessionId) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChat(res.data.chatHistory || []);
        setJsxCode(res.data.code || '');
      } catch (err) {
        alert('Failed to load chat');
      }
    };
    loadChat();
  }, [sessionId, token]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: 'user', text: input }];
    setChat(newChat);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', fontFamily: 'Arial' }}>

      <div style={{
        width: '100%',
        borderRight: '1px solid #eee',
        padding: '1.5rem',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ color: '#6a0dad', marginBottom: '1.2rem' }}>Your Sessions</h2>
        <button
          onClick={createSession}
          style={{
            backgroundColor: '#6a0dad',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          + New Session
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sessions.map((s) => (
            <li key={s._id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => navigate(`/editor/${s._id}`)}
                style={{
                  background: s._id === sessionId ? '#e0d4f7' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  width: '100%',
                  color: '#6a0dad',
                  cursor: 'pointer'
                }}
              >
                Session: {s._id.slice(-6)}
              </button>
            </li>
          ))}
        </ul>
      </div>
   
    </div>
  );
}

export default DashboardEditor;
