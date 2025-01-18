const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug'); //Which view engine to use
app.set('views', 'views'); //Where to look for views

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false })); //parser for form data
app.use(express.static(path.join(__dirname, 'public'))); //Grant read access to this folder

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).render('404', { docTitle: 'Page Not Found' });
});

app.listen(3000);
