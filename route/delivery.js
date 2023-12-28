const router = require('express').Router();
const controller = require('../controller/delivery');
const {saveSingleFile} = require('../utils/gallery');
router.get('/',controller.all);
router.post('/',[saveSingleFile, controller.add]);
router.route('/:id')
    .get(controller.get)
    .delete(controller.drop)
    .patch([saveSingleFile, controller.patch])

module.exports = router;