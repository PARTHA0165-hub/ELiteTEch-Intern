const Document = require('../models/Document');

const saveTimers = {};

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-document', async (docId) => {
      if (!docId) return;
      socket.join(docId);
      console.log(`${socket.id} joined ${docId}`);

      let doc = await Document.findById(docId).lean();
      if (!doc) {
        await Document.create({ _id: docId, content: '' });
        doc = { _id: docId, content: '' };
      }

      socket.emit('load-document', doc.content || '');
      socket.to(docId).emit('user-joined', { id: socket.id });
    });

    socket.on('text-change', ({ docId, content }) => {
      if (!docId) return;
      socket.to(docId).emit('document-update', content);

      if (saveTimers[docId]) clearTimeout(saveTimers[docId]);
      saveTimers[docId] = setTimeout(async () => {
        try {
          await Document.findByIdAndUpdate(docId, { content }, { upsert: true });
        } catch (err) {
          console.error('Save error', err);
        }
      }, 1000);
    });

    socket.on('save-document', async ({ docId, content }) => {
      try {
        await Document.findByIdAndUpdate(docId, { content }, { upsert: true });
        socket.emit('document-saved', { ok: true, docId });
      } catch (err) {
        socket.emit('document-saved', { ok: false, error: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
};
