const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const admin = require('../middleware/admin');

const router = express.Router();

// Multer for responses
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get users for verification
router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find({ verified: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Verify user
router.put('/users/:id/verify', admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.verified = true;
    await user.save();
    res.json({ msg: 'User verified' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add co-admin
router.post('/co-admin', admin, async (req, res) => {
  const { email, assignedBarangays } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = 'co-admin';
    user.assignedBarangays = assignedBarangays;
    await user.save();
    res.json({ msg: 'Co-admin added' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get posts by barangay
router.get('/posts', admin, async (req, res) => {
  const { barangay } = req.query;
  try {
    let query = {};
    if (barangay) query.barangay = barangay;
    // For co-admin, filter by assigned barangays
    if (req.user.role === 'co-admin') {
      query.barangay = { $in: req.user.assignedBarangays };
    }
    const posts = await Post.find(query).populate('user', 'firstName lastName').populate('responses.admin', 'firstName lastName').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Respond to post
router.post('/posts/:id/respond', admin, upload.array('images', 5), async (req, res) => {
  const { text, statusUpdate } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const response = {
      admin: req.user.id,
      text,
      images,
      statusUpdate
    };
    post.responses.push(response);
    if (statusUpdate) post.status = statusUpdate;
    await post.save();

    // Create notification for the user
    const notification = new Notification({
      user: post.user,
      message: 'Your post has been responded to by an admin.',
      type: 'response',
      relatedPost: post._id
    });
    await notification.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;