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
}