const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

router.post('/', async (req, res) => {
  try {
    const { docId, title = 'Untitled Document' } = req.body;
    if (!docId) return res.status(400).json({ error: 'docId required' });
    const exists = await Document.findById(docId);
    if (exists) return res.status(409).json({ error: 'Document already exists' });
    const doc = await Document.create({ _id: docId, title, content: '' });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await Document.findById(docId).lean();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().select('_id title updatedAt').sort({ updatedAt: -1 }).lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
