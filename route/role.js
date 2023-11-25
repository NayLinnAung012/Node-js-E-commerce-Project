const router = require('express').Router();
const controller = require('../controller/role');
const {PermitSchema, AllSchema, RoleSchema} = require('../utils/schema');
const {validateBody, validateParams} = require('../utils/validator');
router.post('/',[validateBody(PermitSchema.add), controller.add]);
router.get('/',controller.all);
router.patch('/add/permit',[validateBody(RoleSchema.addPermit),controller.roleAddPermit]);
router.delete('/remove/permit',[validateBody(RoleSchema.addPermit),controller.roleDropPermit]);
router.route('/:id')
    .get([validateParams(AllSchema.id,'id'),controller.get])
    .patch([validateParams(AllSchema.id,'id'), validateBody(PermitSchema.add),controller.patch])
    .delete([validateParams(AllSchema.id,'id'),controller.drop])
module.exports = router;