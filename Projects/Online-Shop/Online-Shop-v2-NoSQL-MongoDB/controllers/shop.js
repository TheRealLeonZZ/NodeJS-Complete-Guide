const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(
	'sk_test_51RAdJrIMdqYsfTigTw2OYPLka87DtTdioueIIdK7SMwnd4numJbsdhRIo42WU6DlrW1gmzGsTEme8LnWDqUNZ68X00Vsm9z7zZ'
);

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getIndex = (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getProducts = (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Products',
				path: '/products',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
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
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
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
				.catch((err) => {
					const error = new Error(err);
					error.httpStatusCode = 500;
					return next(error); // Pass the error to the next middleware
				});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)

		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getCheckout = (req, res, next) => {
	let cartProducts;
	let totalPrice = 0;
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			cartProducts = user.cart.items;
			totalPrice = 0;
			cartProducts.forEach((p) => {
				totalPrice += p.quantity * p.productId.price;
			});

			return stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: cartProducts.map((p) => {
					return {
						price_data: {
							currency: 'usd',
							product_data: {
								name: p.productId.title,
								description: p.productId.description,
							},
							unit_amount: p.productId.price * 100, // Stripe expects amount in cents
						},
						quantity: p.quantity,
					};
				}),
				mode: 'payment',
				success_url:
					req.protocol + '://' + req.get('host') + '/checkout/success',
				cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
			});
		})
		.then((session) => {
			res.render('shop/checkout', {
				pageTitle: 'Checkout Page',
				path: '/checkout',
				products: cartProducts,
				totalPrice: totalPrice,
				sessionId: session.id,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				pageTitle: 'Your Orders',
				path: '/orders',
				orders: orders,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error // Pass the error to the next middleware to the next middleware
		});
};

exports.getCheckoutSuccess = (req, res, next) => {
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
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
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
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error('No order found.')); // Pass the error to the next middleware
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Unauthorized')); // Pass the error to the next middleware
			}

			const invoiceName = 'invoice-' + orderId + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);

			const pdfDoc = new PDFDocument();
			res.setHeader('Content-Type', 'application/pdf'); // Set the content type to PDF and make the browser open it
			res.setHeader(
				'Content-Disposition',
				'inline; filename="' + invoiceName + '"' // Set the content disposition to inline and set the filename to download
			);
			pdfDoc.pipe(fs.createWriteStream(invoicePath)); // Create a write stream to the invoice path
			pdfDoc.pipe(res); // Pipe the PDF document to the response

			pdfDoc.fontSize(26).text('Invoice', {
				underline: true,
			});
			pdfDoc.fontSize(14).text('-------------------------');
			let totalPrice = 0;
			order.products.forEach((prod) => {
				totalPrice += prod.quantity * prod.product.price;
				pdfDoc
					.fontSize(14)
					.text(
						prod.product.title +
							' - ' +
							prod.quantity +
							' x $' +
							prod.product.price
					);
			});
			pdfDoc.text('-------------------------');
			pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

			pdfDoc.end(); // Finalize the PDF document

			// Reading file to memory and returning it in response
			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		return next(err);
			// 	}
			// 	res.setHeader('Content-Type', 'application/pdf'); // Set the content type to PDF and make the browser open it
			// 	res.setHeader(
			// 		'Content-Disposition',
			// 		'inline; filename="' + invoiceName + '"' // Set the content disposition to inline and set the filename to download
			// 	);
			// 	res.send(data);
			// });
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};
// exports.getCheckout = (req, res, next) => {
// 	res.render('shop/checkout', {
// 		pageTitle: 'Checkout',
// 		path: '/checkout',
// 	});
// };
