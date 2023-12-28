const router = require('express').Router();
const controller = require('../controller/subcat');
const{saveSingleFile} = require('../utils/gallery');
router.get('/',controller.all);
router.post('/',[saveSingleFile,controller.add]);
router.route('/:id')
    .delete(controller.drop)
    .get(controller.get)
    .patch([saveSingleFile, controller.patch])

module.exports = router;