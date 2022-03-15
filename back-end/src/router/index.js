const express = require('express');
const userController = require('../controllers/users.controller');
const productController = require('../controllers/products.controller');
const saleController = require('../controllers/sales.controller');
const ADMController = require('../controllers/adm.controller');
const encryption = require('../middlewares/encryptionMd5');
const { validateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', encryption, userController.create);
router.post('/login', encryption, userController.login);
router.get('/getUsersAll', validateToken, userController.getAllUsers);
router.get('/user/:id', validateToken, userController.getById);

router.get('/getProductsAll', validateToken, productController.getAllProducts);

router.get('/customer/orders', validateToken, saleController.getAllSales);
router.get('/customer/orders/:id', validateToken, saleController.getSaleById);
router.post('/createSale', validateToken, saleController.createSaleController);
router.get('/sellers', validateToken, saleController.getAllSellerController);
router.get('/customer/orders/products/:id', validateToken, saleController.getOrderProductsById);

router.post('/management', validateToken, encryption, ADMController.ADMcreateUser);

module.exports = router;
