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

// Function to get information of an object by ID
async function getObjectById(id) {
    const sql = 'SELECT * FROM type WHERE tid = $1';
    const values = [id];
    const result = await executeQuery(sql, values);
    return result.rows[0]; // Return the first row
}





pool.end;


module.exports = {

   getObjectById,


}