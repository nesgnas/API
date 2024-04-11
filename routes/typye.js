var express = require('express');

const {getTotalProduct} = require('./postgres');
const {getTopSellings} = require('./postgres');
const {getCategoryNumber} = require('./postgres');
const {getOrderNumber} = require('./postgres');
const {getTotalRevenue} = require('./postgres');

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

module.exports = router;