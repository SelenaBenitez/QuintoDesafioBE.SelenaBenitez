// src/dao/models/message.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
