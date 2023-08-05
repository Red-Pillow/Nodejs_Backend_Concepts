const express = require('express');
const router = express.Router(); 
const productController = require('../controllers/product');

router.post('/add-product', productController.addProduct);

router.get('/get-products', productController.getProduct);


router.delete('/delete-product/:id', productController.deleteProduct);


module.exports = router;