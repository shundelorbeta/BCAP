const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  images: [{ type: String }],
  statusUpdate: { type: String, enum: ['pending', 'in progress', 'resolved'] },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, required: true },
  images: [{ type: String }],
  barangay: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in progress', 'resolved'], default: 'pending' },
  responses: [responseSchema],
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);