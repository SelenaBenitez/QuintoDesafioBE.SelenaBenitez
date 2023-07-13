import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const messageModel = mongoose.model('Message', messageSchema);
