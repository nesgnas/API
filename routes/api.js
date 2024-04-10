var express = require('express')
const { getObjectById} = require("./postgres");
var router = express.Router();



// get data in type by id
router.get('/:id', async (req, res) => {
    const objectId = req.params.id;

    const objectInfo = await getObjectById(objectId);
    res.json(objectInfo);

});

router.get('/name',async (req,res)=>{
    await req.send({
        "do":"something"
    })
})



module.exports = router;