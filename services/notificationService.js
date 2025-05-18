const User = require('../models/user');
const Notification = require('../models/Notification');
const emailService = require('./emailService');
const smsService = require('./smsService');
const websocketService = require('./websocketService');
const retryHandler = require('../utils/retryHandler');
const logger = require('../utils/logger');

class NotificationService {
  async createNotification(userId, type, title, message, metadata = {}) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    // Check user preferences
    if (!user.notificationPreferences[type]) {
      throw new Error(`User has disabled ${type} notifications`);
    }

    const notification = new Notification({
      user: user._id,
      type,
      title,
      message,
      metadata
    });

    await notification.save();
    return notification;
  }

  async processNotification(notification) {
    const user = await User.findById(notification.user);
    
    try {
      await Notification.findByIdAndUpdate(notification._id, { 
        status: 'processing' 
      });

      let result;
      switch (notification.type) {
        case 'email':
          result = await retryHandler.retry(
            () => emailService.send(user.email, notification.title, notification.message),
            `Email to ${user.email}`
          );
          break;
        case 'sms':
          result = await retryHandler.retry(
            () => smsService.send(user.phone, notification.message),
            `SMS to ${user.phone}`
          );
          break;
        case 'in-app':
          result = await retryHandler.retry(
            () => websocketService.sendNotification(user.userId, notification.title, notification.message),
            `In-app to ${user.userId}`
          );
          break;
        default:
          throw new Error('Invalid notification type');
      }

      await Notification.findByIdAndUpdate(notification._id, { 
        status: 'sent'
      });
      
      return result;
    } catch (error) {
      await Notification.findByIdAndUpdate(notification._id, { 
        status: 'failed',
        retryCount: notification.retryCount + 1
      });
      throw error;
    }
  }

  async getUserNotifications(userId) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error('User not found');

    return Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'userId name email');
  }
}

module.exports = new NotificationService();