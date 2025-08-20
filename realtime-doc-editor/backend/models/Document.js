const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // docId
  title: { type: String, default: 'Untitled Document' },
  content: { type: mongoose.Schema.Types.Mixed, default: '' } 
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
