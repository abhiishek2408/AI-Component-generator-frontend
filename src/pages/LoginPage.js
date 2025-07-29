import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
  <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)', border: '1px solid #eee', background: '#f9f9f9' }}>
    <h2 style={{ color: '#6a0dad', textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
    <form onSubmit={loginHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }} />
      <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#6a0dad', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseOver={e => e.target.style.backgroundColor = '#5800b3'} onMouseOut={e => e.target.style.backgroundColor = '#6a0dad'}>Login</button>
      <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
        Not registered? <Link to="/register" style={{ color: '#6a0dad', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
      </p>
    </form>
  </div>
</div>

  );
}

export default LoginPage;
