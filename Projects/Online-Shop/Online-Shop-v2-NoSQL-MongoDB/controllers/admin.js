const { validationResult } = require('express-validator'); // Importing validationResult from express-validator

const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
	Product.find({ userId: req.user._id }) // Find products owned by the user
		// .select('title price -_id') //Select only title and price and exclude _id
		// .populate('userId', 'username') //Populate user id and username instead getting just id
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			}); //Arguments are passing dynamic data
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const image = req.file;
	const errors = validationResult(req);
	if (!image) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
			errorMessage: 'Attached file is not an image.',
			validationErrors: [],
		});
	}
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}
	const imageUrl = '/' + image.path; // Use the path of the uploaded file
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user,
	});
	product
		.save()
		.then((result) => {
			console.log('CREATED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			// return res.status(500).render('admin/edit-product', {
			// 	pageTitle: 'Add Product',
			// 	path: '/admin/add-product',
			// 	editing: false,
			// 	hasError: true,
			// 	product: {
			// 		title: title,
			// 		imageUrl: imageUrl,
			// 		price: price,
			// 		description: description,
			// 	},
			// 	errorMessage: 'Database operation failed, please try again.',
			// 	validationErrors: [],
			// });
			// res.redirect('/500'); // Redirect to a custom error page
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: true,
				product: product,
				hasError: false,
				errorMessage: null,
				validationErrors: [],
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const updatedImage = req.file;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDescription,
				_id: prodId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}
	Product.findById(prodId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDescription;
			if (updatedImage) {
				product.imageUrl = '/' + updatedImage.path; // Use the path of the uploaded file
			}
			return product.save().then((result) => {
				console.log('UPDATED PRODUCT');
				res.redirect('/admin/products');
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteOne({ _id: prodId, userId: req.user._id })
		.then(() => {
			console.log('DELETED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error); // Pass the error to the next middleware
		});
};
