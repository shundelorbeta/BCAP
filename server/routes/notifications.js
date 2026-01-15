const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY || 'your-public-key';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || 'your-private-key';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

// @route   GET api/notifications
// @desc    Get notifications for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('relatedPost', 'caption')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error('Push notification failed:', err);
  }
};

// @route   GET api/notifications/public-key
// @desc    Get public VAPID key
// @access  Public
router.get('/public-key', (req, res) => {
  res.json({ key: publicVapidKey });
});

// @route   POST api/notifications/subscribe
// @desc    Subscribe to push notifications
// @access  Private
router.post('/subscribe', auth, async (req, res) => {
  const { subscription } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.pushSubscription = subscription;
    await user.save();
    res.status(201).json({ msg: 'Subscribed to push notifications' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications/send/:userId
// @desc    Send push notification to user
// @access  Private (admin?)
router.post('/send/:userId', auth, async (req, res) => {
  const { title, body } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user.pushSubscription) {
      return res.status(400).json({ msg: 'User not subscribed' });
    }
    await sendPushNotification(user.pushSubscription, { title, body });
    res.json({ msg: 'Push notification sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;