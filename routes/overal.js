var express = require('express');

const {getTotalProduct} = require('./postgres');
const {getTopSellings} = require('./postgres');

var router = express.Router();

/**
 * GET-get the total product in Overal Inventory
 */
router.get('/totalProduct', async(req, res) =>{
    const totalProduct = await getTotalProduct();
    res.json(totalProduct);
})

/**
 * GET-get the top selling in Overal Inventory
 */
router.get('/topselling', async(req, res) => {
    const topselling = await getTopSellings();
    res.json(topselling);

})

module.exports = router;