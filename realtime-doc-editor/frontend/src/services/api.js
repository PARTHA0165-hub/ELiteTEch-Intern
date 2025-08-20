export async function createDocument(docId, title='Untitled Document') {
  try {
    const res = await fetch('http://localhost:5000/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId, title })
    });
    return res.json();
  } catch (err) {
    return { error: err.message };
  }
}
