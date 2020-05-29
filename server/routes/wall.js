const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.write('ok!!');
    res.end();

});


module.exports = router;