exports.getPosts = (req, res, next) => {
	const posts = [
		{
			id: 'p1',
			title: 'First Post',
			content: 'This is the first post!',
		},
		{
			id: 'p2',
			title: 'Second Post',
			content: 'This is the second post!',
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
