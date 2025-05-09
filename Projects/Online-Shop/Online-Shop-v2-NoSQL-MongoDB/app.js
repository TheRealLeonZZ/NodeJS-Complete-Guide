require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images'); //Where to store the file
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname); //File name
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true); //Accept the file
	}
	cb(null, false); //Reject the file
};

app.set('view engine', 'ejs'); //Which view engine to use
app.set('views', 'views'); //Where to look for views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false })); //parser for form data
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
); //parser for form data
app.use(express.static(path.join(__dirname, 'public'))); //Grant read access to this folder
app.use('/images', express.static(path.join(__dirname, 'images'))); //Grant read access to this folder
//initialize session
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	//Make data available to all templates
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err)); // Pass the error to the next middleware
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).render('500', {
		pageTitle: 'An error occurred',
		path: '/500',
		isAuthenticated: req.session.isLoggedIn,
	});
}); //Error handling middleware

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
