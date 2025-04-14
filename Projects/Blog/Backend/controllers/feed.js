const { validationResult } = require('express-validator');

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
	const _id = new Date().toISOString();
	const title = req.body.title;
	const content = req.body.content;
	const creator = { name: 'LeonZZ' };
	const createdAt = new Date();
	const post = {
		_id,
		title,
		content,
		creator,
		createdAt,
	};
	res.status(201).json({
		message: 'Post created successfully!',
		post: post,
	});
};
