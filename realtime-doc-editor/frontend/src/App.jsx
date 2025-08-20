import React from 'react';
import Home from './pages/Home';
import DocumentPage from './pages/DocumentPage';

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith('/doc/')) {
    const parts = path.split('/');
    const docId = parts[2];
    return <DocumentPage docId={docId} />;
  }
  return <Home />;
}
