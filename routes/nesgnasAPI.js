var express = require('express')
const { getObjectById, countProduct, updateType, deleteType, getLowStocks, countCatalog, getListLowQuantity} = require("./postgres");
var router = express.Router();


// GET_API -- list LowQuality
router.get('/listLowQuantity', async (req,res)=>{
    const rs =  await getListLowQuantity();
    res.json(rs)
})


// GET_API --  count Catalog
router.get('/countCatalog', async (req,res)=>{
    const rs = await countCatalog();
    res.json(rs)
})


// GET_API -- count total product
router.get('/countProduct',async (req,res)=>{
    const rs = await countProduct();
    res.json(rs)
})

// GET_API -- count low_stock
router.get('/countLowStock', async (req,res) =>{
    const run  = await getLowStocks();
    res.json(run)
} )

// PUT_CHECK -- update table "type"
router.put('/updateType/:id', async (req,res)=>{
    const {id} = req.params;
    const {tname} = req.body;

    const kq = await updateType(id,tname)
    res.json(kq)
})

// DELETE_CHECK -- delete value in "type" table
router.delete('/delete/:id', async (req,res)=>{
    const {id} = req.params;
    const result = await deleteType(id);
    if (checkResult.rows[0].count > 0) {
        throw new Error('Cannot delete type as it is referenced in the product_category table');
    }
    res.json(result)
})

module.exports = router;