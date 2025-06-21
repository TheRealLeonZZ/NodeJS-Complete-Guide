const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.normalizeEmail()
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-mail address already exists!');
					}
				});
			}),
		body('password')
			.trim()
			.isLength({ min: 5 })
			.withMessage('Please enter a password with at least 5 characters.'),
		body('name').trim().not().isEmpty().withMessage('Please enter a name.'),
	],
	authController.signup
);
router.post('/login', [], authController.login);
router.get('/status', isAuth, authController.getStatus);

module.exports = router;
