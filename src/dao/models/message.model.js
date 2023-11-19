class Message {
  constructor(content, senderId) {
    this.content = content;
    this.senderId = senderId;
    this.timestamp = Date.now();
  }
}

export default Message;
