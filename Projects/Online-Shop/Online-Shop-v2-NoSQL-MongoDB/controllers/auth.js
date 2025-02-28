const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login Page',
		path: '/login',
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('67b396c353e63982747a92ef')
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect('/');
		})
		.catch((err) => console.log(err));
};
