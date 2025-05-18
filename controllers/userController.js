const User = require("../models/user");
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error getting user: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while retrieving user'
    });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'userId name email');

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error(`Error getting user notifications: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while retrieving notifications'
    });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const { email, sms, inApp } = req.body;
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      { 
        $set: { 
          'notificationPreferences.email': email,
          'notificationPreferences.sms': sms,
          'notificationPreferences.inApp': inApp 
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.notificationPreferences
    });
  } catch (error) {
    logger.error(`Error updating user preferences: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error while updating preferences'
    });
  }
};