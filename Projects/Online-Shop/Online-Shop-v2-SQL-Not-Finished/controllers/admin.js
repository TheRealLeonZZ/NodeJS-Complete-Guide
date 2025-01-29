const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;
	Product.create({
		title: title,
		price: price,
		imageUrl: imageUrl,
		description: description,
	})
		.then(() => {
			res.redirect('/');
		})
		.catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findByPk(prodId)
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
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedPrice = req.body.price;
	Product.findByPk(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save();
		})
		.then((result) => {
			console.log('UPDATED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId);
	res.redirect('/admin/products');
};

exports.getAdminProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			}); //Arguments are passing dynamic data
		})
		.catch((err) => console.log(err));
};
