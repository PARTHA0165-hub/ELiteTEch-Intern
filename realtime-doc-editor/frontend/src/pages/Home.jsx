import React, { useState } from 'react';
import { createDocument } from '../services/api';

export default function Home() {
  const [docId, setDocId] = useState('');

  const openDoc = async () => {
    if (!docId.trim()) return alert('Enter docId (alphanumeric, e.g. demo-1)');
    const res = await createDocument(docId.trim());
    if (res.error && res.error !== 'Document already exists') {
      return alert('Error: ' + res.error);
    }
    window.location.href = `/doc/${docId.trim()}`;
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Real-Time Doc Editor</h1>
      </div>

      <div style={{ marginTop: 20 }}>
        <input value={docId} onChange={e => setDocId(e.target.value)} placeholder="doc-id (eg: demo-1)" />
        <button onClick={openDoc} style={{ marginLeft: 8 }}>Create / Open</button>
      </div>

      <p style={{ marginTop: 18, color: '#555' }}>
        Tip: Use same docId in multiple tabs to collaborate.
      </p>
    </div>
  );
}
