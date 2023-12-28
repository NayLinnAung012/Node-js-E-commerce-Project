const router = require('express').Router();
const { saveSingleFile } = require('../utils/gallery');
const controller = require('../controller/warranty');
router.get('/', controller.all);
router.post('/', [saveSingleFile, controller.add]);
router.route('/:id')
    .get(controller.get)
    .delete(controller.drop)
    .patch([saveSingleFile,controller.patch])

module.exports = router;