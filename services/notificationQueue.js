const amqp = require('amqplib');
const config = require('../config/config');
const logger = require('../utils/logger');
const Notification = require('../models/Notification');
const notificationService = require('./notificationService');

class NotificationQueue {
  constructor() {
    this.queueName = 'notifications';
    this.channel = null;
  }

  async connect() {
    try {
      const connection = await amqp.connect(config.RABBITMQ_URL);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      logger.info('Connected to RabbitMQ');
    } catch (error) {
      logger.error(`RabbitMQ connection error: ${error.message}`);
      throw error;
    }
  }

  async publish(notification) {
    if (!this.channel) await this.connect();
    
    try {
      await this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(notification)),
        { persistent: true }
      );
      logger.info(`Notification ${notification._id} published to queue`);
    } catch (error) {
      logger.error(`Publish error: ${error.message}`);
      throw error;
    }
  }

  async consume() {
    if (!this.channel) await this.connect();
    
    this.channel.prefetch(1);
    this.channel.consume(this.queueName, async (msg) => {
      if (msg) {
        const notification = JSON.parse(msg.content.toString());
        try {
          await notificationService.processNotification(notification);
          this.channel.ack(msg);
        } catch (error) {
          logger.error(`Processing error: ${error.message}`);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }
}

module.exports = new NotificationQueue();