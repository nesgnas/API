var express = require('express');

const {getCategoryNumber} = require('./postgres');
const {getOrderNumber} = require('./postgres');
const {getTotalRevenue} = require('./postgres');

var router = express.Router();

/**
 * GET - get category number in home screen
 */
router.get('/category', async(req, res) =>{

    const categoryNumber = await getCategoryNumber();
    res.json(categoryNumber);
})

/**
 * GET - get order number in home screen
 */
router.get('/order', async(req, res) =>{
    const orderNumber = await getOrderNumber();
    res.json(orderNumber);
})

/**
 * GET - get revenue number in home screen
 * this get API still wrong due to wrong query
 */
router.get('/revenue', async(req, res) =>{
    const totalRevenue = await getTotalRevenue();
    res.json(totalRevenue);
})

module.exports = router;