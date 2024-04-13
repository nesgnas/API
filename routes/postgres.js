const { query } = require('express');
const {Pool} = require('pg')
require('dotenv').config()

const pool = new Pool({
   user: process.env.USER,
   password:process.env.PASSWORD,
   host:process.env.HOST,
   port:process.env.PORT_DB,
   database:process.env.DATABASE
})

async function executeQuery(sql, values) {
    const result = await pool.query(sql, values);
    return result;
}

// GET -- Function to get information of an object by ID
async function getObjectById(id) {
    const sql = 'SELECT * FROM type WHERE tid = $1';
    const values = [id];
    const result = await executeQuery(sql, values);
    return result.rows[0]; // Return the first row
}

// GET -- low stocks
async function getLowStocks(){
    const str = ['Low Stock']
    const sql  = 'SELECT COUNT(Status) AS Low_Qquantity_Stock FROM product_warehouse WHERE status = $1 ';
    const query = await pool.query(sql,str)
    //console.log(query)
    return query.rows[0];
}

// GET -- list low-quantity-stock
async function getListLowQuantity(){
    const srt = 'SELECT DISTINCT Product.Pname FROM Product INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID and Product_Warehouse.Status = $1';
    const value = ['In Stock']
    const result = await pool.query(srt,value)
    console.log(result)
    return result.rows[0];

}

//GET - function to get the total prodcut
async function getTotalProduct(){
    const sql = 'SELECT COUNT( DISTINCT Product_Warehouse.PID) as TotalProductOfSpecificWarehouse FROM Product_Warehouse';

    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET - function to get the top selling
async function getTopSellings(){
    const sql = `
    SELECT COUNT(DISTINCT PID) AS Top_selling
    FROM Export
    WHERE ExportQuantity > 10
      AND TO_CHAR(TO_DATE(ExportDate, 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM');`;

    const result = await executeQuery(sql);
    return result.rows[0];
}

//POST CHECK - function to add type
async function createType(TID, TName){
    const sql = 'INSERT INTO type(TID, TName) VALUES (($1), ($2)) RETURNING *';
    // const sql = `INSERT INTO type(TID, TName) VALUES (${TID}, ${TName}) RETURNING *`
    const values = [TID, TName];

    const createItem = await executeQuery(sql, values);
    return createItem;
}

//PUT CHECK - function to update type by id
async function updateItem(ID, TName){
    const sql = 'UPDATE type SET TName= $1 WHERE TID= $2 RETURNING *;';
    const values = [TName, ID];

    const updatedITem = await executeQuery(sql, values);
    return updatedITem;
}

//DELETE CHECK - functio to delete type by id
async function deleteObjectById(id){
    const sql = 'DELETE FROM type WHERE tid= $1 RETURNING *;'
    const values = [id];

    const deleteObject = await executeQuery(sql, values);

    return deleteObject;
}

//GET - function to get total revenue
async function getTotalRevenue(){
    const sql = `
    CREATE OR REPLACE FUNCTION fetch_records_from_past_months(months_ago INT)
    RETURNS TABLE(LastUpdatedDate VARCHAR, revenue NUMERIC) AS
    $$
    BEGIN
    RETURN QUERY
    SELECT PW.LastUpdatedDate,
    (SUM(P.unitprice * PW.Quantity) - SUM(P.costprice * PW.Quantity)) AS revenue
    FROM Product AS P
    INNER JOIN Product_Warehouse AS PW ON P.PID = PW.PID
    WHERE TO_DATE(PW.LastUpdatedDate, 'DD-MM-YYYY') >= (CURRENT_DATE - INTERVAL '1 month' * months_ago)
    GROUP BY PW.LastUpdatedDate;
    END;
    $$ LANGUAGE plpgsql;
    
    SELECT * FROM fetch_records_from_past_months(4);
    `;
    const result = await executeQuery(sql);
    return result;
}

//GET - function to get total order
async function getOrderNumber(){
    const sql = 'SELECT COUNT(DISTINCT EID) AS Total_order FROM Export';
    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET - function to get category number
async function getCategoryNumber(){
    const sql = 'SELECT COUNT(*) AS Total_Product_Category_Associations FROM Product_Category;';
    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET CHECK - function to get tokens
async function getToken(email, password){
    const sql = 'SELECT * FROM Users WHERE email= $1 AND password= $2';
    const values = [email, password];
    const result = await executeQuery(sql, values);

    if(!result.rows.length === 0){
        return {
            'token': 1,
            'message': 'success'
        }
    }
    else{
        return {
            'token': 2,
            'message': 'wrong username or password'
        }
    }
}


// GET -- countCatalogies
async function countCatalog(){
    const sql = 'SELECT COUNT(*) AS Total_Product_Category_Associations FROM Product_Category';
    const rslt = await pool.query(sql)
    return rslt.rows[0]
}

// GET -- countProduct
async function countProduct(){
    const sql = 'SELECT COUNT(DISTINCT Product_Warehouse.PID) as TotalProductOfSpecificWarehouse FROM Product_Warehouse';
    const count = await pool.query(sql);
    return count.rows[0]
}

// CHECK_PULL -- update value by id in type table
async function updateType(id,tname){
    console.log("ID = ",id)
    console.log("tname = ",tname)
    const qr = 'UPDATE type SET tname = $1 where tid = $2'
    const vl = [tname,id];
    const rst = await pool.query(qr,vl)
    return {message:"update success"}
}

// CHECK_DELETE -- delete value by id in type table
async function deleteType(id){
    const qry = 'DELETE FROM "type" WHERE tid = $1';
    const val = [id];
    const reslt =  await pool.query(qry,val)
    return {message:"delete success"}
}

//GET funtion to return product list
async function getProductList(){
    const sql = `SELECT Product.Pname,Product_Warehouse.PID, Type.TName , Product.UnitPrice, Product_Warehouse.Status
                FROM Product
                    INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID
                    INNER JOIN Product_Category ON Product.PID = Product_Category.PID
                    INNER JOIN Type ON Product_Category.TID = Type.TID;`

    const result = await executeQuery(sql);
    return result.rows;
}

/**
 * GET - funtion to return all the supplier
 */
async function getSuppliers(){
    const sql = `SELECT * FROM Supplier`;
    const result = await executeQuery(sql);
    return result.rows;
}

/**
 * POST - function to insert A supplier to database
 */
async function insertSupplierIntoDatabase(SupplierName, SupplierContact, SupplierAddress){
    const sql = `INSERT INTO Supplier ( SupplierName, SupplierContact, SupplierAddress)
                VALUES ($1, $2, $3)
                RETURNING *;`;
    const values = [SupplierName, SupplierContact, SupplierAddress];
    const result = await executeQuery(sql, values);
    return result.rows[0];
}

/**
 * POST - function to insert new product to database
 */
async function insertNewProduct(productID, productName, productSupplierName, productPrice, productUnitPrice){
    const sql = `INSERT INTO Product(PID, Pname , SupplierName, CostPrice , UnitPrice)
            VALUES ($1 , $2, $3, $4, $5)
            RETURNING *;`;
    const values = [productID, productName, productSupplierName, productPrice, productUnitPrice];
    const result = await executeQuery(sql, values);

    return result.rows[0];
}

/**
 * POST - function to insert new item to productcategory table
 */
async function insertNewItemToProductCategoryTable(productName, supplierName, productTypeName){
    const sql = `INSERT INTO Product_Category(PID, TID)
            VALUES ((SELECT PID FROM Product WHERE PName = $1 AND Product.SupplierName = $2),(SELECT Type.TID FROM Type WHERE TName = $3))
            RETURNING *;`;
    const values = [productName, supplierName, productTypeName];
    const result = await executeQuery(sql, values);
    return result.rows[0];
    
}

/**
 * GET - funtion to get all order
 */
async function getAllOrder(){
    const sql = `select order_detail.order_detail_date , codeorder , suppliername from order_detail;
    `;
    const result = await executeQuery(sql)

    return result.rows;
}

/** GET - function to get all product on product page */
async function getAllProdct(){
    const sql = `SELECT Product.PID, Type.TName ,Product.Pname,Supplier.SupplierName, Product_Warehouse.Status
                FROM Product
                    INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID
                    INNER JOIN Product_Category ON Product.PID = Product_Category.PID
                    INNER JOIN Type ON Product_Category.TID = Type.TID
                    INNER JOIN Supplier ON Supplier.Suppliername = Product.Suppliername;`;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
 * Part of the new order API - get all product by supplier
 */
async function getAllProductbySupplier(supplierName){
    const sql = `SELECT Product.Pname FROM Product WHERE Product.SupplierName = $1;`;
    const value = [supplierName];
    const result = await executeQuery(sql, value);

    return result.rows;
}

/**
 * Part of the new order API - get all warehouse
 */
async function getAllWarehouseName(){
    const sql = `SELECT Warehouse.WName FROM Warehouse;`;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
 * Part of the new order API - get all supplier name
 */
async function getAllSupplierName(){
    const allSupplier = await getSuppliers();

    const allSupplierName = getSupplierName(allSupplier);

    return allSupplierName;
}

//funtion to get all supplier name from a json object array
function getSupplierName(allSupplier){
    var supplierNames = [];
    for(var supplier of allSupplier){
        supplierNames.push(supplier.suppliername);
    }
    return supplierNames;
}

//POST - function to create new order
async function createNewOrder(orders){
    const sql = `INSERT INTO Order_Detail(Order_Detail_Date, SupplierName) 
            VALUES (current_timestamp, $1);`;
    const value = [orders[0].SupplierName];
    await executeQuery(sql, value);

    for(var order of orders){
        await insertIntoProductOrderTable(order);
        await insertIntoProductWarehouseTable(order);
    }

    return { message: "create success" }
}

//function to insert into productOrder table - part of create new order POST
async function insertIntoProductOrderTable(order){
    const sql = `INSERT INTO Product_Order(PID, ProductName, SupplierName, WarehouseName, Order_Detail_ID, OrderDate, OrderQuantity)
    WITH Needed_PID AS (
        SELECT Product.PID AS NeededPID 
        FROM Product 
        WHERE Product.Pname = $1 AND Product.SupplierName = $2
    )
    SELECT Needed_PID.NeededPID, $3, $4, $5, (    
        SELECT Order_Detail.CodeOrder 
        FROM Order_Detail 
        ORDER BY CodeOrder DESC LIMIT 1
    ), CURRENT_TIMESTAMP, $6
    FROM Needed_PID;
    `;
    const values = [order.ProductName, order.SupplierName, order.ProductName, order.SupplierName, order.Warehouse, order.Quantity];
    await executeQuery(sql, values);
}

//function to insert into productWarehouse table - part of create new order POST
async function insertIntoProductWarehouseTable(order){
    const sql = `INSERT INTO Product_Warehouse (WName, PID, Quantity)
    WITH NeededPID AS (
        SELECT Product.PID AS NeededPID FROM Product WHERE Product.Pname = $1 AND Product.SupplierName = $2
    ),
    Existing_Record AS (
        SELECT *
        FROM Product_Warehouse
        WHERE PID = (SELECT NeededPID FROM NeededPID) AND WName = $3
    )
    SELECT $4, NeededPID.NeededPID, $5
    FROM NeededPID
    ON CONFLICT (PID, WName) DO UPDATE
    SET
        Quantity = Product_Warehouse.Quantity + EXCLUDED.Quantity,
        LastUpdatedDate = to_char(LOCALTIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY'),
        LastUpdatedTime = to_char(LOCALTIMESTAMP AT TIME ZONE 'GMT+7','HH24:MI:SS'),
        Status = CASE
                     WHEN Product_Warehouse.Quantity + EXCLUDED.Quantity <= 0 THEN 'Out of Stock'
                     WHEN Product_Warehouse.Quantity + EXCLUDED.Quantity < 10 THEN 'Low Stock'
                     ELSE 'In Stock'
                END;
    `;
    const values = [order.ProductName, order.SupplierName, order.Warehouse, order.Warehouse, order.Quantity];
    await executeQuery(sql, values);
}

//function to get all category name
async function getCategoryNameInProductForm(){
    const sql = `SELECT TName from Type`;
    const result = await executeQuery(sql);
    
    return result.rows;
}


pool.end;


module.exports = {

   getObjectById,
    countProduct,
    updateType,
    deleteType,
    getLowStocks,
    countCatalog,
    getListLowQuantity,

   getToken,
   getCategoryNumber,
   getOrderNumber,
   getTotalRevenue,
   deleteObjectById,
   createType,
   updateItem,
   getTotalProduct,
   getTopSellings,
   getProductList,
   getSuppliers,
   insertSupplierIntoDatabase,
   insertNewProduct,
   insertNewItemToProductCategoryTable,
   getAllOrder,
   getAllProdct,
   getAllProductbySupplier,
   getAllWarehouseName,
   getAllSupplierName,
   createNewOrder,
   getCategoryNameInProductForm,
}