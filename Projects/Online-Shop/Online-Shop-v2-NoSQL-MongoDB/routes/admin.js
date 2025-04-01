const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', isAuth, adminController.getAdminProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post(
	'/add-product',
	[
		check('title').isString().isLength({ min: 3 }).trim(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).isString().trim(),
	],
	isAuth,
	adminController.postAddProduct
);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post(
	'/edit-product',
	[
		check('title').isString().isLength({ min: 3 }).trim(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).isString().trim(),
	],
	isAuth,
	adminController.postEditProduct
);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
