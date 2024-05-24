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
const {getCategoryNameInProductForm} = require('./postgres');
const {getSupplierById} = require('./postgres');
const {getOrderDetailByCodeOrder} = require('./postgres');
const {exportProduct} = require('./postgres');
const {deleleProduct} = require('./postgres');
const {getProductByID} = require('./postgres');
const {deleteSupplierByName} = require('./postgres');
const {getPercentageCapacity} = require('./postgres');
const {getTotalMoney} = require('./postgres');
const {getTotalOrder} = require('./postgres');
const {newGetSuppliers} = require('./postgres');
const {editProduct} = require('./postgres');
const {editSupplier} = require('./postgres');
const {getExportHistory} = require('./postgres');




var router = express.Router();

const auth = require('../middleware/auth');

router.use(auth)
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
 * GET get supplier by id
 */
router.get('/supplier/:supplierId', async(req, res) =>{
    const {supplierId} = req.params; 
    const supplier = await getSupplierById(supplierId);

    res.json(supplier);
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

    const productInserted = await insertNewProduct(pid, pname, suppliername, costprice, unitprice);
    const itemProductCategoryInserted = await insertNewItemToProductCategoryTable(pname, suppliername, TName);

    res.json({
        "message": "add successfully",
        "productInserted": productInserted,
        "itemProductCategoryInserted": itemProductCategoryInserted 
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
router.get('/order/products/:supplierName', async(req, res) =>{

    const {supplierName} = req.params;
    const allProduct = await getAllProductbySupplier(supplierName);
  
    res.json(allProduct);
})

/**
 * GEt - get product by product name
 */


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

/**
 * GET - to get all category name 
 */
router.get('/product/category', async(req, res) =>{
    const categories = await getCategoryNameInProductForm();

    res.json(categories);
})

/**
 * GET - to get order detail by codeorder
 */
router.get('/order/:codeOrder', async(req, res) =>{
    const {codeOrder} = req.params;

    const orderDetail = await getOrderDetailByCodeOrder(codeOrder);

    res.json(orderDetail);
})


/**
 * GET - get product by product name
 */
router.get('/product/:productID', async(req, res) =>{
    const {productID} = req.params

    const product = await getProductByID(productID);

    res.json(product);
})

/**
 * POST - export product
 */
router.post('/export', async(req, res) =>{
    const {warehouseName, productName, supplierName, exportQuantity, employeeName} = req.body;
    const message = await exportProduct(warehouseName, productName, supplierName, exportQuantity, employeeName);

    res.json(message);
})

/**
 * DELETE - delete product when export
 */

router.delete('/product/productlist/:id', async(req, res) =>{
    const {id} = req.params;
    const message = await deleleProduct(id);

    res.json(message);
})

/**
 * DELETE - delete supplier
 */
router.delete('/supplier/:supplierName', async(req, res) =>{
    const {supplierName} = req.params;
    const message = await deleteSupplierByName(supplierName);

    res.json(message);

})

/**
 * GET total money
 */
router.get('/dashboard/totalMoney', async(req, res) =>{
    
    const data = await getTotalMoney();

    res.json(data);
})

/*
 * GET total order for chart
 */
router.get('/dashboard/totalOrder', async(req, res) =>{
    
    const data = await getTotalOrder();

    res.json(data);
})



/**
 * GET get data for chart 
 */
router.get('/dashboard/:warehouseName', async(req, res) =>{
    const {warehouseName} = req.params;
    const data = await getPercentageCapacity(warehouseName);

    res.json(data);
})

/**
 * POST edit product form
 */
router.post('/product/productList/:id', async(req, res) =>{
    const {id} = req.params;
    const {inputProductName, inputSupplierName, inputCostPrice, inputUnitPrice, inputCategory} = req.body;

    const product = await getProductByID(id);
    const message = await editProduct(product, inputProductName, inputSupplierName, inputCostPrice, inputUnitPrice, inputCategory);

    res.json(message);
})

/**
 * POST edit supplier form
 */
router.post('/supplier/supplierLlist/:id', async(req, res) =>{
    const {id} = req.params;
    const {inputSupplierName, inputSupplierContact, inputSupplierAddress} = req.body;
    console.log("huy dep trai")

    const supplier = await getSupplierById(id);
    console.log("supplier ID: " + supplier.sid);
    console.log("product: " + supplier.suppliername);

    const message = await editSupplier(supplier, inputSupplierName, inputSupplierContact, inputSupplierAddress);

    res.json(message);
})

/**
 * GET export history
 */
router.get('/exportHistory', async(req, res) =>{
    const data = await getExportHistory();

    res.json(data);
});

// /**
//  * POST set category for product
//  */
// router.post('/product/:id/addCategory', async(req, res) =>{
//     const {id} = req.params;
//     const {inputCategory} = req.body;
//     const message = setCategoryForProduct(id, inputCategory);

//     res.json(message);
// })


module.exports = router;