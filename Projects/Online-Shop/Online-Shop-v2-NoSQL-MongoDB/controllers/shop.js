const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Shop',
				path: '/products',
				isAuthenticated: req.session.isLoggedIn,
			}); //Arguments are passing dynamic data
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const cartProducts = user.cart.items;
			res.render('shop/cart', {
				pageTitle: 'Your Cart',
				path: '/cart',
				products: cartProducts,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user
				.addToCart(product)
				.then((result) => {
					res.redirect('/cart');
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)

		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				pageTitle: 'Your Orders',
				path: '/orders',
				orders: orders,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const cartProducts = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					userId: req.user,
				},
				products: cartProducts,
			});
			return order.save();
		})
		.then(() => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
// 	res.render('shop/checkout', {
// 		pageTitle: 'Checkout',
// 		path: '/checkout',
// 	});
// };
