<<<<<<< HEAD
// src/dao/models/message.model.js
=======
>>>>>>> 65e94491e06e2214180c8b49c15cb29fd3fb05db
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

<<<<<<< HEAD
const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
=======
export const messageModel = mongoose.model('Message', messageSchema);
>>>>>>> 65e94491e06e2214180c8b49c15cb29fd3fb05db
