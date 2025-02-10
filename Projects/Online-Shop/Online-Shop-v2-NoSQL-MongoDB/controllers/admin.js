const Product = require('../models/product');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const product = new Product(title, price, description, imageUrl);
	product
		.save()
		.then((result) => {
			console.log('CREATED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
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
			});
		})
		.catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const updatedImageUrl = req.body.imageUrl;
	const product = new Product(
		updatedTitle,
		updatedPrice,
		updatedDescription,
		updatedImageUrl,
		new ObjectId(prodId)
	);
	return product
		.save()
		.then((result) => {
			console.log('UPDATED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

// exports.postDeleteProduct = (req, res, next) => {
// 	const prodId = req.body.productId;
// 	Product.findByPk(prodId)
// 		.then((product) => {
// 			return product.destroy();
// 		})
// 		.then((result) => {
// 			console.log('DELETED PRODUCT');
// 			res.redirect('/admin/products');
// 		})
// 		.catch((err) => console.log(err));
// };

exports.getAdminProducts = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			}); //Arguments are passing dynamic data
		})
		.catch((err) => console.log(err));
};
