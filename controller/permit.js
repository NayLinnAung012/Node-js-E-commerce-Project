const DB = require('../models/permit');
const Helper = require('../utils/helper');

const all = async(req,res,next)=>{
    let permit = await DB.find().select('-__v');
    Helper.fMsg(res,"All permit", permit);
}
const get = async(req,res,next)=>{
    let permit = await DB.findById(req.params.id).select('-__v');
    if(permit){
        Helper.fMsg(res,"Get single permit", permit);
    }else{
        next(new Error("No permit with that id."));
    }
    
}

const add = async(req,res,next)=>{
    // console.log(req.body)
    let dbPermit = await DB.findOne({name:req.body.name});
    // console.log(dbPermit)
    if(dbPermit){
        next(new Error("This name already in used."));
    }else{
        let result = await new DB(req.body).save();
        Helper.fMsg(res,"Permission Save.",result);
    }
   
}
const patch = async(req,res,next)=>{
    let dbPermit = await DB.findById(req.params.id).select('-__v');
    if(dbPermit){
        await DB.findByIdAndUpdate(dbPermit._id,req.body);
        dbPermit = await DB.findById(req.params.id);
        Helper.fMsg(res, "Permit Updated.",dbPermit);
    }else{
        next(new Error("No permit with that id."))
    }
}
const drop = async(req,res,next)=>{
    let dbPermit = await DB.findById(req.params.id);
    if(dbPermit){
        await DB.findByIdAndDelete(dbPermit._id);
        Helper.fMsg(res,"Permit deleted.");
    }else{
        next(new Error("No permit with that id."))
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}