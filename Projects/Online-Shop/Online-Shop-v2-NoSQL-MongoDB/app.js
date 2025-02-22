const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); //Which view engine to use
app.set('views', 'views'); //Where to look for views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false })); //parser for form data
app.use(express.static(path.join(__dirname, 'public'))); //Grant read access to this folder

app.use((req, res, next) => {
	User.findById('67b396c353e63982747a92ef')
		.then((user) => {
			req.user = user; //Add user to request
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		'mongodb+srv://leoneli61:ldNEYiVZi5IUOP6Q@cluster0.5anly.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => {
		User.findOne() //Without arguments finds the first user.
			.then((user) => {
				if (!user) {
					const user = new User({
						username: 'leoneli61',
						email: 'leon@example.com',
						cart: { items: [] },
					});
					user.save();
				}
			})
			.catch((err) => console.log(err));
		app.listen(3000);
	})
	.catch((err) => console.log(err));
