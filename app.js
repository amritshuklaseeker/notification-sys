const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./utils/logger');
const notificationQueue = require('./services/notificationQueue');

const app = express();

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Start queue consumer
notificationQueue.consume().catch(err => {
  logger.error('Failed to start queue consumer:', err);
});

// Routes
const userController = require('./controllers/userController');
const notificationController = require('./controllers/notificationController');

// User routes
app.get('/users/:id', userController.getUser);
app.patch('/users/:id/preferences', userController.updateUserPreferences);

// Notification routes
app.post('/notifications', notificationController.sendNotification);
app.get('/users/:id/notifications', userController.getUserNotifications);
app.get('/users/:id/notifications/:notificationId', userController.getNotificationById);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;