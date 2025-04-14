const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);
router.post(
	'/post',
	[
		body('title')
			.trim()
			.isLength({ min: 5 })
			.withMessage('Title must be at least 5 characters long.'),
		body('content')
			.trim()
			.isLength({ min: 5 })
			.withMessage('Content must be at least 5 characters long.'),
	],
	feedController.createPost
);
router.get('/post/:postId', feedController.getPost);

module.exports = router;
