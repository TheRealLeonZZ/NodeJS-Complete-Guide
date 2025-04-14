const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
	const posts = [
		{
			_id: '1',
			title: 'First Post',
			content: 'This is the first post!',
			imageURL: 'images/carmelibi.png',
			creator: {
				name: 'LeonZZ',
			},
			createdAt: new Date(),
		},
	];
	res.status(200).json({
		message: 'Posts fetched successfully!',
		posts: posts,
	});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: 'Validation failed, entered data is incorrect.',
			errors: errors.array(),
		});
	}
	const title = req.body.title;
	const content = req.body.content;
	const creator = { name: 'LeonZZ' };
	const post = new Post({
		title: title,
		content: content,
		imageUrl: 'images/carmelibi.png',
		creator: creator,
	});
	post
		.save()
		.then((result) => {
			res.status(201).json({
				message: 'Post created successfully!',
				post: result,
			});
		})
		.catch((err) => console.log(err));
};
