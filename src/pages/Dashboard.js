import React from 'react';
import Sidebar from './Sidebar';
import EditorPage from './EditorPage';
import { useParams, useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const sessionId = location.pathname.split('/').pop();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '20%', borderRight: '1px solid #ccc' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
  
        <EditorPage sessionId={sessionId !== 'dashboard' ? sessionId : null} />
      </div>
    </div>
  );
}

export default Dashboard;
