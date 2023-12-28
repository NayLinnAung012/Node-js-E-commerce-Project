const router = require('express').Router();
const controller = require('../controller/permit');
const {PermitSchema,AllSchema} = require('../utils/schema');
const {validateBody,validateParams,validateToken} = require('../utils/validator');
router.post('/',[validateToken(),validateBody(PermitSchema.add),controller.add]);
router.get('/',controller.all);

router.route('/:id')
    .get([validateParams(AllSchema.id,'id'),controller.get])
    .patch([validateParams(AllSchema.id,'id'), validateBody(PermitSchema.add),controller.patch])
    .delete([validateParams(AllSchema.id,'id'),controller.drop])

module.exports = router;