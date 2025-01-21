const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
	res.render('shop/index', {
		pageTitle: 'Shop',
		path: '/',
	});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'Shop',
			path: '/product-list',
		}); //Arguments are passing dymanic data
	});
};

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		pageTitle: 'Cart',
		path: '/cart',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
	});
};
