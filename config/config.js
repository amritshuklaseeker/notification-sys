require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/notification-service',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3'),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '5000'),
  EMAIL_API_KEY: process.env.EMAIL_API_KEY,
  SMS_API_KEY: process.env.SMS_API_KEY
};