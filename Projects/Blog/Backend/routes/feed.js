const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
router.post(
	'/post',
	isAuth,
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
router.get('/post/:postId', isAuth, feedController.getPost);
router.put(
	'/post/:postId',
	isAuth,
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
	feedController.updatePost
);
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
