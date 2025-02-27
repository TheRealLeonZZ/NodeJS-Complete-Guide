exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login Page',
		path: '/login',
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};
