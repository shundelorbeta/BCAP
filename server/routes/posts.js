const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'firstName lastName').populate('responses.admin', 'firstName lastName').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create post
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { caption, barangay } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];
  try {
    const post = new Post({
      user: req.user.id,
      caption,
      images,
      barangay
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Like/Unlike post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const index = post.likes.indexOf(req.user.id);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Report post
router.post('/:id/report', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (!post.reportedBy.includes(req.user.id)) {
      post.reportedBy.push(req.user.id);
    }
    await post.save();
    res.json({ msg: 'Post reported' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;