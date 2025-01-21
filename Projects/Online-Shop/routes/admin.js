const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.getAdminProducts);
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

module.exports = router;
