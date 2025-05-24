const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
	createUser: async function ({ userInput }, req) {
		const errors = [];
		if (!validator.isEmail(userInput.email)) {
			errors.push({ message: 'Email is invalid.' });
		}
		const existingUser = await User.findOne({ email: userInput.email });
		if (existingUser) {
			errors.push({ message: 'User exists already.' });
		}
		if (
			validator.isEmpty(userInput.password) ||
			!validator.isLength(userInput.password, { min: 5 })
		) {
			errors.push({ message: 'Password is invalid.' });
		}
		if (errors.length > 0) {
			const error = new Error('Invalid input.');
			error.data = errors;
			error.code = 422;
			throw error;
		}
		const hashedPw = await bcrypt.hash(userInput.password, 12);
		const user = new User({
			email: userInput.email,
			name: userInput.name,
			password: hashedPw,
		});
		const createdUser = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},
	login: async function ({ email, password }) {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('User not found.');
			error.code = 401;
			throw error;
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error('Password is incorrect.');
			error.code = 401;
			throw error;
		}
		const token = jwt.sign(
			{ userId: user._id.toString(), email: user.email },
			'secretkey',
			{ expiresIn: '1h' }
		);
		return { token: token, userId: user._id.toString() };
	},
};
