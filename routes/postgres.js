const { query } = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT_DB,
    database: process.env.DATABASE,
});

async function executeQuery(sql, values) {
    const result = await pool.query(sql, values);
    return result;
}

// GET -- Function to get information of an object by ID
async function getObjectById(id) {
    const sql = "SELECT * FROM type WHERE tid = $1";
    const values = [id];
    const result = await executeQuery(sql, values);
    return result.rows[0]; // Return the first row
}

// GET -- low stocks
async function getLowStocks() {
    const str = ["Low Stock"];
    const sql =
        "SELECT COUNT(Status) AS Low_Qquantity_Stock FROM product_warehouse WHERE status = $1 ";
    const query = await pool.query(sql, str);
    //console.log(query)
    return query.rows[0];
}

// GET -- list low-quantity-stock
async function getListLowQuantity() {
    const srt =
        "SELECT DISTINCT Product.Pname FROM Product INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID and Product_Warehouse.Status = $1";
    const value = ["In Stock"];
    const result = await pool.query(srt, value);
    console.log(result);
    return result.rows[0];
}

//GET - function to get the total prodcut
async function getTotalProduct() {
    const sql =
        "SELECT COUNT( DISTINCT Product_Warehouse.PID) as TotalProductOfSpecificWarehouse FROM Product_Warehouse";

    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET - function to get the top selling
async function getTopSellings() {
    const sql = `
    SELECT COUNT(DISTINCT PID) AS Top_selling
    FROM Export
    WHERE ExportQuantity > 10
      AND TO_CHAR(TO_DATE(ExportDate, 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM');`;

    const result = await executeQuery(sql);
    return result.rows[0];
}

//POST CHECK - function to add type
async function createType(TID, TName) {
    const sql = "INSERT INTO type(TID, TName) VALUES (($1), ($2)) RETURNING *";
    // const sql = `INSERT INTO type(TID, TName) VALUES (${TID}, ${TName}) RETURNING *`
    const values = [TID, TName];

    const createItem = await executeQuery(sql, values);
    return createItem;
}

//PUT CHECK - function to update type by id
async function updateItem(ID, TName) {
    const sql = "UPDATE type SET TName= $1 WHERE TID= $2 RETURNING *;";
    const values = [TName, ID];

    const updatedITem = await executeQuery(sql, values);
    return updatedITem;
}

//DELETE CHECK - functio to delete type by id
async function deleteObjectById(id) {
    const sql = "DELETE FROM type WHERE tid= $1 RETURNING *;";
    const values = [id];

    const deleteObject = await executeQuery(sql, values);

    return deleteObject;
}

//GET - function to get total revenue
async function getTotalRevenue() {
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
async function getOrderNumber() {
    const sql = "SELECT COUNT(DISTINCT EID) AS Total_order FROM Export";
    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET - function to get category number
async function getCategoryNumber() {
    const sql =
        "SELECT COUNT(*) AS Total_Product_Category_Associations FROM Product_Category;";
    const result = await executeQuery(sql);
    return result.rows[0];
}

//GET CHECK - function to get tokens
async function getToken(email, password) {
    const sql = "SELECT * FROM Users WHERE email= $1 AND password= $2";
    const values = [email, password];
    const result = await executeQuery(sql, values);

    if (!result.rows.length === 0) {
        return {
            token: 1,
            message: "success",
        };
    } else {
        return {
            token: 2,
            message: "wrong username or password",
        };
    }
}

// GET -- countCatalogies
async function countCatalog() {
    const sql =
        "SELECT COUNT(*) AS Total_Product_Category_Associations FROM Product_Category";
    const rslt = await pool.query(sql);
    return rslt.rows[0];
}

// GET -- countProduct
async function countProduct() {
    const sql =
        "SELECT COUNT(DISTINCT Product_Warehouse.PID) as TotalProductOfSpecificWarehouse FROM Product_Warehouse";
    const count = await pool.query(sql);
    return count.rows[0];
}

// CHECK_PULL -- update value by id in type table
async function updateType(id, tname) {
    console.log("ID = ", id);
    console.log("tname = ", tname);
    const qr = "UPDATE type SET tname = $1 where tid = $2";
    const vl = [tname, id];
    const rst = await pool.query(qr, vl);
    return { message: "update success" };
}

// CHECK_DELETE -- delete value by id in type table
async function deleteType(id) {
    const qry = 'DELETE FROM "type" WHERE tid = $1';
    const val = [id];
    const reslt = await pool.query(qry, val);
    return { message: "delete success" };
}

//GET funtion to return product list
async function getProductList() {
    // const sql = `SELECT Product.Pname,Product_Warehouse.PID, Type.TName , Product.UnitPrice, Product_Warehouse.Status, Product_Warehouse.WName, 
    //             FROM Product
    //                 INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID
    //                 INNER JOIN Product_Category ON Product.PID = Product_Category.PID
    //                 INNER JOIN Type ON Product_Category.TID = Type.TID;`;

    const sql = `
    SELECT pw.WName , p.PName , t.TName,p.UnitPrice , pw.Quantity, pw.Status FROM Product p INNER JOIN Product_Warehouse pw ON p.PID = pw.PID JOIN Product_Category pc ON pw.PID = pc.PID JOIN Type t  ON pc.TID = t.TID;
    `

    const result = await executeQuery(sql);
    return result.rows;
}

async function getSuppliers() {
    const sql = `SELECT * FROM Supplier`;
    const result = await executeQuery(sql);
    return result.rows;
}

/**
 * GET - funtion to return all the supplier
 */
async function newGetSuppliers() {
    const sql = `SELECT SupplierName , SupplierContact , SupplierAddress FROM Supplier;`;
    const result = await executeQuery(sql);
    return result.rows;
}

/**
 * GET - function to get supplier by id
 */
async function getSupplierById(supplierId) {
    const sql = `SELECT * FROM Supplier WHERE sid= $1`;

    const value = [supplierId];
    const result = await executeQuery(sql, value);

    return result.rows[0];
}

/**
 * POST - function to insert A supplier to database
 */
async function insertSupplierIntoDatabase(
    SupplierName,
    SupplierContact,
    SupplierAddress
) {
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
async function insertNewProduct(
    productID,
    productName,
    productSupplierName,
    productPrice,
    productUnitPrice
) {
    const sql = `INSERT INTO Product(PID, Pname , SupplierName, CostPrice , UnitPrice)
            VALUES ($1 , $2, $3, $4, $5)
            RETURNING *;`;
    const values = [
        productID,
        productName,
        productSupplierName,
        productPrice,
        productUnitPrice,
    ];
    const result = await executeQuery(sql, values);

    return result.rows[0];
}

/**
 * POST - function to insert new item to productcategory table
 */
async function insertNewItemToProductCategoryTable(
    productName,
    supplierName,
    productTypeName
) {
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
async function getAllOrder() {
    const sql = `select order_detail.order_detail_date , codeorder , suppliername from order_detail;
    `;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
 * GET - function to get order detail by code order
 */
const getOrderDetailByCodeOrder = async (codeOrder) => {
    // const sql = `SELECT ProductName , OrderQuantity , Product.UnitPrice, WarehouseName
    //             FROM Product RIGHT JOIN Order_History ON (Order_History.PID = Product.PID) 
    //             WHERE order_history.order_detail_id = $1;`;

    const sql = `select * FROM Order_History  WHERE Order_Detail_ID = $1;`
    const value = [codeOrder];
    const result = await executeQuery(sql, value);

    return result.rows;
};

/** GET - function to get all product on product page */
async function getAllProdct() {
    // const sql = `SELECT Product.PID, Type.TName as Category,Product.Pname,Supplier.SupplierName, Product_Warehouse.Status, Product.unitprice, Product.costprice
    //             FROM Product
    //                 INNER JOIN Product_Warehouse ON Product.PID = Product_Warehouse.PID
    //                 INNER JOIN Product_Category ON Product.PID = Product_Category.PID
    //                 INNER JOIN Type ON Product_Category.TID = Type.TID
    //                 INNER JOIN Supplier ON Supplier.Suppliername = Product.Suppliername;`;

    const sql = `SELECT Product.PID , PName , Type.TName , Product.SupplierName , Product.CostPrice , Product.UnitPrice 
    FROM Product INNER JOIN Product_Category ON Product.PID = Product_Category.PID 
    INNER JOIN Type ON Product_Category.TID = Type.TID;`;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
 * Part of the new order API - get all product by supplier
 */
async function getAllProductbySupplier(supplierName) {
    const sql = `SELECT Product.Pname, Product.PID FROM Product WHERE Product.SupplierName = $1;`;
    const value = [supplierName];
    const result = await executeQuery(sql, value);

    return result.rows;
}

/**
 * Part of the new order API - get all warehouse
 */
async function getAllWarehouseName() {
    const sql = `SELECT Warehouse.WName FROM Warehouse;`;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
 * Part of the new order API - get all supplier name
 */
async function getAllSupplierName() {
    const allSupplier = await getSuppliers();

    const allSupplierName = getSupplierName(allSupplier);

    return allSupplierName;
}

//funtion to get all supplier name from a json object array
function getSupplierName(allSupplier) {
    var supplierNames = [];
    for (var supplier of allSupplier) {
        supplierNames.push(supplier.suppliername);
    }
    return supplierNames;
}

//POST - function to create new order
async function createNewOrder(orders) {
    await insertIntoOrderDetail(orders[0]);
    for (var order of orders) {
        await insertIntoProductOrderTable(order);
        await insertIntoProductWarehouseTable(order);
    }

    return { message: "create success" };
}

async function insertIntoOrderDetail(order) {
    // const sql = `INSERT INTO Order_Detail(Order_Detail_Date, SupplierName) VALUES ((current_timestamp,'DD/MM/YYYY'), $1);`;
    console.log("order detail");
    const sql = `INSERT INTO Order_Detail (SupplierName, Order_Detail_Date) 
    VALUES ($1, TO_CHAR(LOCALTIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY HH24:MI:SS'));`;
    const value = [order.SupplierName];
    await executeQuery(sql, value);
}

//function to insert into productOrder table - part of create new order POST
async function insertIntoProductOrderTable(order) {
    console.log("productorder");
    const sql = `
    INSERT INTO Product_Order(PID, ProductName, SupplierName, WarehouseName, Order_Detail_ID, OrderDate, OrderQuantity)
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
    const values = [
        order.ProductName,
        order.SupplierName,
        order.ProductName,
        order.SupplierName,
        order.WarehouseName,
        order.Quantity,
    ];
    await executeQuery(sql, values);
}

//function to insert into productWarehouse table - part of create new order POST
async function insertIntoProductWarehouseTable(order) {
    console.log("product warehose");
    const sql = `
    INSERT INTO Product_Warehouse (WName, PID, Quantity, LastUpdatedDate, LastUpdatedTime, Status) 
    VALUES (
        $1, 
        (SELECT Product.PID
        FROM Product 
        WHERE Product.Pname = $2
        AND Product.SupplierName = $3), 
        $4,
        TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MYYYY'),
        TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'HH24:MI:SS'),
        CASE
            WHEN $5 <= 0 THEN 'Out of Stock'
            WHEN $6 < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END
    )
    ON CONFLICT (PID, WName) DO UPDATE SET
        Quantity = Product_Warehouse.Quantity + EXCLUDED.Quantity,
        LastUpdatedDate = TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY'),
        LastUpdatedTime = TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'HH24:MI:SS'),
        Status = CASE
            WHEN (Product_Warehouse.Quantity + EXCLUDED.Quantity) <= 0 THEN 'Out of Stock'
            WHEN (Product_Warehouse.Quantity + EXCLUDED.Quantity) < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END;
    `;
    const values = [
        order.WarehouseName,
        order.ProductName,
        order.SupplierName,
        order.Quantity,
        order.Quantity,
        order.Quantity,
    ];
    // const sql=`
    // DO $$
    // DECLARE
    //     v_max_capacity INTEGER;
    //     v_current_quantity INTEGER;
    //     v_new_quantity INTEGER;
    //     v_product_id varchar(100);
    // BEGIN
    //     SELECT wcapacity INTO v_max_capacity
    //     FROM Warehouse_Capacity
    //     WHERE WName = $1;

    //     SELECT PID INTO v_product_id
    //     FROM Product
    //     WHERE Pname = $2 AND SupplierName = $3;

    //     SELECT COALESCE(SUM(Quantity), 0) INTO v_current_quantity
    //     FROM Product_Warehouse
    //     WHERE WName = $4;

    //     v_new_quantity := v_current_quantity + $5;

    //     -- Check if the new quantity exceeds the max capacity
    //     IF v_new_quantity > v_max_capacity THEN
    //         RAISE EXCEPTION 'Total quantity % exceeds max capacity % in %', v_new_quantity, v_max_capacity, $6;
    //     ELSE
    //         -- Perform the insert or update
    //         INSERT INTO Product_Warehouse (WName, PID, Quantity, LastUpdatedDate, LastUpdatedTime, Status)
    //         VALUES (
    //             $7,
    //             v_product_id,
    //             $8,
    //             TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY'),
    //             TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'HH24:MI:SS'),
    //             CASE
    //                 WHEN v_new_quantity  <= 0 THEN 'Out of Stock'
    //                 WHEN v_new_quantity < 10 THEN 'Low Stock'
    //                 ELSE 'In Stock'
    //             END
    //         )
    //         ON CONFLICT (PID, WName) DO UPDATE SET
    //             Quantity = Product_Warehouse.Quantity + EXCLUDED.Quantity,
    //             LastUpdatedDate = TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY'),
    //             LastUpdatedTime = TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'GMT+7', 'HH24:MI:SS'),
    //             Status = CASE
    //                 WHEN (Product_Warehouse.Quantity + EXCLUDED.Quantity) <= 0 THEN 'Out of Stock'
    //                 WHEN (Product_Warehouse.Quantity + EXCLUDED.Quantity) < 10 THEN 'Low Stock'
    //                 ELSE 'In Stock'
    //             END;
    //     END IF;
    // END $$;
    // `;
    // values = [order.WarehouseName, order.ProductName, order.SupplierName, order.WarehouseName, order.Quantity, order.WarehouseName, order.WarehouseName, order.Quantity];
    await executeQuery(sql, values);
}

//function to get all category name
async function getCategoryNameInProductForm() {
    const sql = `SELECT TName from Type`;
    const result = await executeQuery(sql);

    return result.rows;
}

/**
    get prodcut by product id
 */
async function getProductByID(productID) {
    // const sql = "SELECT * FROM product WHERE pid= $1;";
    const sql = `
        SELECT 
        p.pid, 
        p.pname, 
        p.suppliername, 
        p.sid, 
        p.costprice, 
        p.unitprice, 
        t.tname AS category
    FROM 
        product p
    JOIN 
        product_category pc ON p.pid = pc.pid
    JOIN 
        type t ON pc.tid = t.tid
    WHERE 
        p.pid = $1;

    `
    const values = [productID];

    const result = await executeQuery(sql, values);

    return result.rows[0];
}

/**
 * post export product
 */
async function exportProduct(
    warehouseName,
    productName,
    supplierName,
    exportQuantity,
    employeeName
) {
    await insertIntoExportTable(
        warehouseName,
        productName,
        supplierName,
        exportQuantity,
        employeeName
    );
    console.log("done insert into export");
    await updateProductWarehouse(
        warehouseName,
        productName,
        supplierName,
        exportQuantity
    );
    console.log("done update");

    return {
        message: "succcess",
    };
}

async function insertIntoExportTable(
    warehouseName,
    productName,
    supplierName,
    exportQuantity,
    employeeName
) {
    const sql = `
    INSERT INTO Export (WName, PID, ProductName, SupplierName, ExportQuantity, ExportDate, EmployeeName)
    VALUES (
    $1,
    (SELECT p.PID FROM Product p WHERE p.PName = $2 AND p.SupplierName = $3),
    $4,
    $5,
    $6,
    TO_CHAR(CURRENT_TIMESTAMP , 'DD/MM/YYYY'),
    $7
    );
    `;
    const values = [
        warehouseName,
        productName,
        supplierName,
        productName,
        supplierName,
        exportQuantity,
        employeeName
    ];

    await executeQuery(sql, values);
}

async function updateProductWarehouse(
    warehouseName,
    productName,
    supplierName,
    exportQuantity
) {
    const sql = `
    WITH Needed_export_PID AS (
        SELECT Product.PID AS NeededPID
        FROM Product
        WHERE Product.Pname = $1 AND Product.SupplierName = $2
        ),
        Existing_Record AS (
        SELECT *
        FROM Product_Warehouse
        WHERE PID = (SELECT NeededPID FROM Needed_export_PID) AND WName = $3
        )
        -- Perform the update if conditions are met
        UPDATE Product_Warehouse AS pw
        SET
        Quantity = CASE
        WHEN pw.Quantity >= $4  THEN pw.Quantity - $5
        ELSE pw.Quantity  -- Do not change Quantity when insufficient
        END,
        LastUpdatedDate = TO_CHAR(LOCALTIMESTAMP AT TIME ZONE 'GMT+7', 'DD/MM/YYYY'),
        LastUpdatedTime = TO_CHAR(LOCALTIMESTAMP AT TIME ZONE 'GMT+7', 'HH24:MI:SS'),
        Status = CASE
        WHEN pw.Quantity - $6 = 0 THEN 'Out of Stock'
        WHEN pw.Quantity - $7 < 10 THEN 'Low Stock'
        ELSE 'In Stock'
        END
        FROM Existing_Record er
        
        WHERE pw.PID = er.PID AND pw.WName = $8;
    `;
    values = [
        productName,
        supplierName,
        warehouseName,
        exportQuantity,
        exportQuantity,
        exportQuantity,
        exportQuantity,
        warehouseName,
    ];

    await executeQuery(sql, values);
}

/**
 * DELETE product when exporting
 */
async function deleleProduct(id) {
    await deleteProductInProductOrder(id);
    await deleteProductInExport(id);
    await deleteProductInProductWarehouse(id);
    await deleteProductInProductCategory(id);
    await deleteProductInProduct(id);

    return {
        message: "success",
    };
}

async function deleteProductInProductOrder(id) {
    const sql = "DELETE FROM Product_Order WHERE PID = $1;";
    const value = [id];

    await executeQuery(sql, value);
}

async function deleteProductInExport(id) {
    const sql = "DELETE FROM Export WHERE PID = $1;";
    const value = [id];

    await executeQuery(sql, value);
}

async function deleteProductInProductWarehouse(id) {
    const sql = "DELETE FROM Product_Warehouse WHERE PID = $1;";
    const value = [id];

    await executeQuery(sql, value);
}

async function deleteProductInProductCategory(id) {
    const sql = "DELETE FROM Product_Category WHERE PID = $1;";
    const value = [id];

    await executeQuery(sql, value);
}

async function deleteProductInProduct(id) {
    const sql = "DELETE from Product where PID = $1;";
    const value = [id];

    await executeQuery(sql, value);
}

/**
 * Delete supplier by name
 */
async function deleteSupplierByName(supplierName) {
    await deleteFromProductWareHouse(supplierName);
    console.log(1);
    await deleteFromProductOrder(supplierName);
    console.log(2);
    await deleteFromProductCategory(supplierName);
    console.log(3);
    await deleteFromProduct(supplierName);
    console.log(4);
    await deleteFromSupplier(supplierName);
    console.log(5);

    return {
        message: "success",
    };
}

async function deleteFromProductWareHouse(supplierName) {
    const sql = `
    DELETE FROM product_warehouse
	WHERE PID IN (SELECT PID FROM Product WHERE SupplierName = $1)
    `;
    const value = [supplierName];

    await executeQuery(sql, value);
}

async function deleteFromProductOrder(supplierName) {
    const sql = `
    DELETE FROM product_order
	WHERE PID IN (SELECT PID FROM Product WHERE SupplierName = $1)
    `;
    const value = [supplierName];

    await executeQuery(sql, value);
}

async function deleteFromProductCategory(supplierName) {
    const sql = `
    DELETE FROM product_category
	WHERE PID IN (SELECT PID FROM Product WHERE SupplierName = $1)
    `;
    const value = [supplierName];

    await executeQuery(sql, value);
}

async function deleteFromProduct(supplierName) {
    const sql = `
    DELETE FROM PRODUCT
	WHERE SupplierName = $1
    `;
    const value = [supplierName];

    await executeQuery(sql, value);
}

async function deleteFromSupplier(supplierName) {
    const sql = `
    DELETE FROM Supplier
	WHERE SID = (SELECT SID FROM Supplier WHERE SupplierName = $1);
    `;
    const value = [supplierName];

    await executeQuery(sql, value);
}

/**
 * GET percentate capacity
 */
async function getPercentageCapacity(warehouseName) {
    const sql = `
        SELECT 
        pw.WName,
        ((SUM(pw.Quantity::float) / wc.Wcapacity::float) * 100) AS Account_Space_Percentage,
        (100 - ((SUM(pw.Quantity::float) / wc.Wcapacity::float) * 100)) AS Free_Space_Percentage
    FROM 
        Product_Warehouse pw
    JOIN 
        Warehouse_capacity wc 
    ON 
        pw.WName = wc.WName 
    WHERE 
        pw.WName = $1
    GROUP BY 
        pw.WName, wc.Wcapacity;
    `;
    const values = [warehouseName];
    console.log("here");

    const data = await executeQuery(sql, values);

    return data.rows;
}

/**
 * GET total money
 */
async function getTotalMoney() {
    const sql = `
    SELECT
    COALESCE(SUM(e.ExportQuantity * p.UnitPrice), 0) AS total_price
    FROM
    (
    SELECT DISTINCT EXTRACT(MONTH FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY')) AS month_number
    FROM Dim_date d
    WHERE EXTRACT(YEAR FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY')) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) months
    LEFT JOIN (
    SELECT
    e.ExportQuantity,
    e.PID,
    e.ExportDate,
    e.WName
    FROM
    Export_History e
    WHERE
    EXTRACT(YEAR FROM TO_DATE(e.ExportDate, 'DD-MM-YYYY')) = EXTRACT(YEAR FROM CURRENT_DATE)

    ) e ON EXTRACT(MONTH FROM TO_DATE(e.ExportDate, 'DD-MM-YYYY')) = months.month_number

    LEFT JOIN Product p ON p.PID = e.PID
    GROUP BY
    months.month_number
    ORDER BY
    months.month_number ASC;
    `;

    console.log("huy dep trai");
    const data = await executeQuery(sql, []);

    return data.rows;
}

/**
 * GET tatol order
 */
async function getTotalOrder() {
    sql = `
        SELECT
    COUNT(DISTINCT e.EID)
    FROM
    Export_History e
    RIGHT JOIN
    Dim_date d ON EXTRACT(DAY FROM TO_DATE(e.ExportDate, 'DD-MM-YYYY')) = EXTRACT(DAY FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY'))
    AND EXTRACT(MONTH FROM TO_DATE(e.ExportDate, 'DD-MM-YYYY')) = EXTRACT(MONTH FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY'))
    AND EXTRACT(YEAR FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY')) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY
    EXTRACT(MONTH FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY'))
    ORDER BY
    EXTRACT(MONTH FROM TO_DATE(d.Currentdate, 'DD-MM-YYYY')) ASC;
    `;
    const data = await executeQuery(sql);
    return data.rows;
}

/**
 * POST to edit product
 */
async function editProduct(
    {
        pname: currentProductName,
        suppliername: currentSupplierName,
        costprice: currentCostPrice,
        unitprice: currentUnitPrice,
        pid: currentID,
    },
    inputProductName,
    inputSupplierName,
    inputCostPrice,
    inputUnitPrice,
    inputCategory
) {
    currentCostPrice =
        currentCostPrice !== undefined ? +currentCostPrice : null;
    inputCostPrice = inputCostPrice !== undefined ? +inputCostPrice : null;
    currentUnitPrice =
        currentUnitPrice !== undefined ? +currentUnitPrice : null;
    inputUnitPrice = inputUnitPrice !== undefined ? +inputUnitPrice : null;

    console.log("curr costprice: " + typeof currentCostPrice);
    console.log("costprice: " + typeof inputCostPrice);

    const sql = `
        UPDATE Product
        SET 
            Pname = COALESCE($1, $2),
            SupplierName = COALESCE($3, $4),
            SID = COALESCE(
                (SELECT SID FROM Supplier WHERE SupplierName = $5),
                (SELECT SID FROM Supplier WHERE SupplierName = $6)
            ),
            CostPrice = COALESCE($7::numeric, $8::numeric),
            UnitPrice = COALESCE($9::numeric, $10::numeric)
        WHERE PID = $11;
    `;

    const values = [
        inputProductName,
        currentProductName,
        inputSupplierName,
        currentSupplierName,
        inputSupplierName,
        currentSupplierName,
        inputCostPrice,
        currentCostPrice,
        inputUnitPrice,
        currentUnitPrice,
        currentID,
    ];

    const currentCategory = getCategoryById(currentID);
    console.log('current Category: ' + currentCategory);

    await editCategory(inputCategory, currentCategory, currentID);

    await executeQuery(sql, values);

    return {
        message: "success",
    };
}

async function editCategory(inputCategory, currentCategory, currentID){
    const sql = `
        UPDATE Product_Category
    SET 
        TID = COALESCE((SELECT TID FROM Type WHERE TName = $1), (SELECT TID FROM Type WHERE TName = $2))
    WHERE 
        PID = $3;
    `;
    const values = [inputCategory, currentCategory, currentID];

    await executeQuery(sql, values);
}

async function getCategoryById(currentID){
    const sql = `
    SELECT DISTINCT TName FROM Type t INNER JOIN Product_Category pc 
    ON t.TID = pc.TID JOIN Product p ON pc.PID = $1;
    `;
    const values = [currentID];
    const result = await executeQuery(sql, values);

    return result.rows[0];
}
/**
 * POST edit supplier
 */
async function editSupplier(
    {
        sid: supplierID,
        suppliername: supplierName,
        suppliercontact: supplerContact,
        supplieraddress: supplierAddress,
    },
    inputSupplierName,
    inputSupplierContact,
    inputSupplierAddress
) {
    const sql = `
        UPDATE Supplier
    SET 
        SupplierName = COALESCE($1, $2),
        SupplierContact = COALESCE($3, $4),
        SupplierAddress = COALESCE($5, $6)
    WHERE 
        SID = (SELECT SID FROM Supplier WHERE SupplierName = $7);
        `;
    const values = [inputSupplierName, supplierName, inputSupplierContact, supplerContact, inputSupplierAddress, supplierAddress, supplierName];

    await executeQuery(sql, values);

    return {
        create: "success"
    }
}

/**
 * GET export history
 */
async function getExportHistory(){
    const sql = "SELECT * FROM export_history;";

    const data = await executeQuery(sql);

    return data.rows;
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
    getSupplierById,
    getOrderDetailByCodeOrder,
    exportProduct,
    deleleProduct,
    getProductByID,
    deleteSupplierByName,
    getPercentageCapacity,
    getTotalMoney,
    getTotalOrder,
    newGetSuppliers,
    editProduct,
    editSupplier,
    getExportHistory,
};
