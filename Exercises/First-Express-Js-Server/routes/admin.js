const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false })); //parser for form data

router.get('/add-product', (req, res, next) => {
	res.send(
		'<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
	);
});

router.post('/product', (req, res, next) => {
	console.log(req.body); // { title: 'Test' }
	res.redirect('/');
});

module.exports = router;
