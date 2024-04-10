var express = require('express');
var router = express.Router();

const {getToken} = require("./postgres");

/**
 * GET TEST
 */
router.get('/', async(req, res) =>{
    const {email} = req.body;
    const {password} = req.password;
    
    const message = await getToken(email, password);
    res.json(message);
})

module.exports = router;