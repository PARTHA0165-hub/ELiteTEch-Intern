import React from 'react';
import Editor from '../components/Editor';

export default function DocumentPage({ docId }) {
  return (
    <div className="app">
      <div className="header">
        <h2>Document: {docId}</h2>
      </div>
      <Editor docId={docId} />
    </div>
  );
}
