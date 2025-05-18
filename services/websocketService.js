const logger = require('../utils/logger');

class WebsocketService {
  constructor() {
    this.connections = new Map();
  }

  addConnection(userId, socket) {
    this.connections.set(userId, socket);
    logger.info(`User ${userId} connected`);
  }

  removeConnection(userId) {
    this.connections.delete(userId);
    logger.info(`User ${userId} disconnected`);
  }

  sendNotification(userId, title, message) {
    try {
      const socket = this.connections.get(userId);
      if (!socket) throw new Error('User not connected');
      
      socket.emit('notification', { title, message });
      logger.info(`In-app notification sent to ${userId}`);
      return true;
    } catch (error) {
      logger.error(`WebsocketService error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new WebsocketService();