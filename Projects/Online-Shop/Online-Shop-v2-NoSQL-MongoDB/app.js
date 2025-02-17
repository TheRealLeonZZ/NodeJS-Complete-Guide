const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); //Which view engine to use
app.set('views', 'views'); //Where to look for views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false })); //parser for form data
app.use(express.static(path.join(__dirname, 'public'))); //Grant read access to this folder

// app.use((req, res, next) => {
// 	User.findById('67aa22eb2894cac4a70f8c3d')
// 		.then((user) => {
// 			req.user = new User(user.username, user.email, user.cart, user._id); //Add user
// 			next();
// 		})
// 		.catch((err) => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		'mongodb+srv://leoneli61:ldNEYiVZi5IUOP6Q@cluster0.5anly.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => console.log(err));
