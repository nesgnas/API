var express = require('express');

const {getTotalProduct} = require('./postgres');
const {getTopSellings} = require('./postgres');
const {getCategoryNumber} = require('./postgres');
const {getOrderNumber} = require('./postgres');
const {getTotalRevenue} = require('./postgres');
const {getProductList} = require('./postgres');
const {getSuppliers} = require('./postgres');
const {insertSupplierIntoDatabase} = require('./postgres');
const {insertNewProduct} = require('./postgres');
const {insertNewItemToProductCategoryTable} = require('./postgres');
const {getAllOrder} = require('./postgres');
const {getAllProdct} = require('./postgres');
const {getAllProductbySupplier} = require('./postgres');
const {getAllWarehouseName} = require('./postgres');
const {getAllSupplierName} = require('./postgres');
const {createNewOrder} = require('./postgres');

var router = express.Router();

/**
 * GET-get the total product in Overal Inventory
 */
router.get('/overal/totalProduct', async(req, res) =>{
    const totalProduct = await getTotalProduct();
    res.json(totalProduct);
})

/**
 * GET-get the top selling in Overal Inventory
 */
router.get('/overal/topselling', async(req, res) => {
    const topselling = await getTopSellings();
    res.json(topselling);

})

/**
 * GET - get category number in home screen
 */
router.get('/home/category', async(req, res) =>{

    const categoryNumber = await getCategoryNumber();
    res.json(categoryNumber);
})

/**
 * GET - get order number in home screen
 */
router.get('/home/order', async(req, res) =>{
    const orderNumber = await getOrderNumber();
    res.json(orderNumber);
})

/**
 * GET - get the list of product in the database
 */
router.get('/product_list', async(req, res) =>{
    const products = await getProductList();
    res.json(products);
})

/**
 * GET show supplier
 */
router.get('/supplier', async(req, res) =>{
    const suppliers = await getSuppliers();
    res.json(suppliers);
})

/**
 * POST - add suppliers
 */
router.post('/supplier', async(req, res) => {
    const {SupplierName, SupplierContact, SupplierAddress} = req.body;

    const createdSupplier = await insertSupplierIntoDatabase(SupplierName, SupplierContact, SupplierAddress);

    res.json(createdSupplier);
})

/**
 * POST - add product to product table and product_category
 */
router.post('/product', async(req, res) =>{
    const {pid, pname, suppliername, costprice, unitprice, TName } = req.body;

    await insertNewProduct(pid, pname, suppliername, costprice, unitprice);
    await insertNewItemToProductCategoryTable(pname, suppliername, TName);

    res.json({
        "message": "add successfully"
    });
})

/**
 * GET - get all the order
 */
router.get('/order', async(req, res) =>{
    const allOrder = await getAllOrder();

    res.json(allOrder)
})

/**
 * GET - get all product in the database 
 */
router.get('/product', async(req, res) =>{
    const allProduct = await getAllProdct();

    res.json(allProduct);
})

/**
 * GET - get all product by supplier name (part of the function new order)
 */
router.get('/order/products', async(req, res) =>{

    const {supplierName} = req.body;
    const allProduct = await getAllProductbySupplier(supplierName);

    res.json(allProduct);
})

/**
 * GET - get all warehouse (part of the function new oreder)
 */
router.get('/order/warehouse', async(req, res) =>{

    const allWarehouse = await getAllWarehouseName();

    res.json(allWarehouse);
})

/**
 * GET - get all supplier name (part of the function new order)
 */
router.get('/order/supplier', async(req, res) =>{
    const allSupplier = await getAllSupplierName();

    res.json(allSupplier);
})

/**
 * POST - new order api, create new order
 */
router.post('/order', async(req, res) =>{
    const {orders} = req.body;
    const message = await createNewOrder(orders);

    res.json(message);
})

module.exports = router;