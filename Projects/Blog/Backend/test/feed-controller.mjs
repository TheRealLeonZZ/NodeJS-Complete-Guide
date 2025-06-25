import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import sinon from 'sinon'; // Importing sinon for mocking
import mongoose from 'mongoose'; // Importing mongoose for database operations

import User from '../models/user.js';
import Post from '../models/post.js';
import feedController from '../controllers/feed.js';

describe('Feed Controller', () => {
	before((done) => {
		mongoose
			.connect(process.env.MONGO_TEST_URI)
			.then(() => {
				const user = new User({
					email: 'test@test.com',
					password: 'abc123',
					name: 'Test User',
					posts: [],
					_id: '68223bc816700cd0e2fbb08b',
				});
				return user.save(); // Saving the user to the database
			})
			.then(() => {
				done();
			});
	});

	it('should add a created post to the posts of the creator', (done) => {
		const req = {
			body: {
				title: 'Test Post',
				content: 'This is a test post content.',
			},
			file: {
				path: 'test/path/to/image.jpg', // Mocking the file upload
			},
			userId: '68223bc816700cd0e2fbb08b', // The ID of the user created in before hook
		};

		const res = {
			status: function () {
				return this;
			},
			json: function () {},
		};

		feedController
			.createPost(req, res, () => {})
			.then((savedUser) => {
				expect(savedUser).to.have.property('posts');
				expect(savedUser.posts).to.have.length(1);
				done();
			})
			.catch((err) => {
				console.log(err);
			});
	});

	after((done) => {
		User.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done(); // Indicating that the test is done
			}); // Cleaning up the database after the test
	});
});
