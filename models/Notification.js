const mongoose = require('mongoose');
const logger = require('../utils/logger');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email', 'sms', 'in-app'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'sent', 'failed'], 
    default: 'pending' 
  },
  retryCount: { 
    type: Number, 
    default: 0 
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Add indexes for better performance
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);