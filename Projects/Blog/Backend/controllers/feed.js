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
	const id = new Date().toISOString();
	const title = req.body.title;
	const content = req.body.content;
	const post = { id, title, content };
	res.status(201).json({
		message: 'Post created successfully!',
		post: post,
	});
};
