var express = require('express')
const { getObjectById} = require("./postgres");
const { deleteObjectById} = require("./postgres");
const { createType} = require("./postgres");
const { updateItem} = require("./postgres");

const auth = require('../middleware/auth');

var router = express.Router();



router.use(auth)

// get data in type by id
router.get('/:id', async (req, res) => {
    const objectId = req.params.id;

    const objectInfo = await getObjectById(objectId);
    res.json(objectInfo);

});

/**
 * GET-CHECK
 */
router.get('/name',async (req,res)=>{
    await req.send({
        "do":"something"
    })
})

/**
 * POST-CHECK
 * create type
 */
router.post('/', async(req, res) =>{
    // const {TID, TName} = req.body;
    const {TID, TName} = req.body;


    const createItem = await createType(TID, TName);

    res.json(createItem);
})

router.post('/huh', async(req, res) =>{
    res.json({
        "message": "add successfully",

    });
})



/**
 * PUT_CHECK
 * update the type by ID, accept TName
 */
router.put('/:id', async(req, res) =>{
    const {id} = req.params;
    const{TName} = req.body;

    const updatedItem = await updateItem(id, TName);
    res.json(updatedItem)
})

/**
 * DELETE-CHECK
 * delete type by id
 */
router.delete('/:id', async(req, res) =>{
    const {id} = req.params;
    const message = await deleteObjectById(id);
    res.json(message);
})



module.exports = router;