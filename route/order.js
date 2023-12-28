const router = require('express').Router();
const controller = require('../controller/order');
const {validateToken} = require('../utils/validator');

router.post('/',validateToken(),controller.add);
router.get('/my',validateToken(),controller.myOrder);

module.exports = router;