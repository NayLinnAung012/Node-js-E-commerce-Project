const DB = require('../models/role');
const DBPermit = require('../models/permit');
const Helper = require('../utils/helper');
const permit = require('../models/permit');

const add = async (req, res, next) => {
    const dbRole = await DB.findOne({ name: req.body.name });
    if (dbRole) {
        next(new Error("Role already in used"));
    } else {
        const result = await new DB(req.body).save();
        Helper.fMsg(res, "New Role Added", result);
    }
};
const all = async (req, res, next) => {
    const dbRole = await DB.find().populate('permits', '-__v');
    Helper.fMsg(res, "All Role", dbRole);
}
const get = async (req, res, next) => {
    const dbRole = await DB.findById(req.params.id).select('-__v');
    if (dbRole) {
        Helper.fMsg(res, "Single Role", dbRole);
    } else {
        next(new Error("No Role with that id"));
    }
}
const patch = async (req, res, next) => {
    const dbRole = await DB.findById(req.params.id).select('-__v');
    if (dbRole) {
        await DB.findByIdAndUpdate(dbRole._id, req.body);
        const result = await DB.findById(req.params.id);
        Helper.fMsg(res, "Role Update", result);
    } else {
        next(new Error("NO Role with that id"));
    }
}
const drop = async(req,res,next)=>{
    const dbRole = await DB.findById(req.params.id);
    if(dbRole){
        await DB.findByIdAndDelete(dbRole._id);
        Helper.fMsg(res,"Role Deleted")
    }else{
        next(new Error("No Role with that id"))
    }
}
const roleAddPermit = async(req,res,next)=>{
    const dbRole = await DB.findById(req.body.roleId);
    const dbPermit = await DBPermit.findById(req.body.permitId);
    if(dbRole && dbPermit){
        await DB.findByIdAndUpdate(dbRole.permits, {$push:{permits:dbPermit._id}});
        const result = await DB.findById(dbRole._id);
        Helper.fMsg(res,"Added Permit and Role ID", result);
    }else{
        next(new Error("No ID for Role and Permit and need to valided!"));
    }
}
const roleDropPermit = async(req,res,next)=>{
    const dbRole = await DB.findById(req.body.roleId);
    const dbPermit = await DBPermit.findById(req.body.permitId);
    if(dbRole && dbPermit){
        await DB.findByIdAndUpdate(dbRole._id,{$pull:{permits:dbPermit._id}});
        const result = await DB.findById(dbRole._id);
        Helper.fMsg(res,"Deleted Permit from Role",result);
    }else{
        next(new Error("This Permit Id is not Valid!"));
    }
}


module.exports = {
    add,
    all,
    get,
    patch,
    drop,
    roleAddPermit,
    roleDropPermit
}