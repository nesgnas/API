const {Pool} = require('pg')
const {as} = require("pg-promise");
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
    getListLowQuantity

}