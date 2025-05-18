const notificationService = require('../services/notificationService');
const notificationQueue = require('../services/notificationQueue');

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, title, message } = req.body;
    
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification = await notificationService.createNotification(
      userId,
      type,
      title,
      message
    );

    await notificationQueue.publish(notification);

    res.status(202).json({
      message: 'Notification accepted for processing',
      notificationId: notification._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.params.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};