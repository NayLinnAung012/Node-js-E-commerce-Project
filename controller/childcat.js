const DB = require('../models/childcat');
const SubCatDB = require('../models/subcat');
const Helper = require('../utils/helper');
const all = async (req, res) => {
    let result = await DB.find();
    Helper.fMsg(res, "All ChildCategories", result);
}
const add = async (req, res, next) => {
    let dbChild = await DB.findOne({ name: req.body.name });
    if (dbChild) {
        next(new Error("No childCat with that id"));

    } else {
        let dbSub = await SubCatDB.findById(req.body.subcatId);
        if (dbSub) {
            let result = await new DB(req.body).save();
            await SubCatDB.findByIdAndUpdate(dbSub._id, { $push: { childcats: result._id } });
            Helper.fMsg(res, "ChildCategory Added", result);
        } else {
            next(new Error("This ChildCat is not validated in Subcat."))
        }

    }
}
const get = async (req, res, next) => {
    let result = await DB.findById(req.params.id);
    Helper.fMsg(res, "Single Child Category", result);
}
const drop = async (req, res, next) => {
    let dbChild = await DB.findById(req.params.id);
    if (dbChild) {
        let dbSub = await SubCatDB.findById(dbChild.subcatId);
        if (dbSub) {
            await SubCatDB.findByIdAndUpdate(dbChild.subcatId, { $pull: { childcats: dbChild._id } });
            await DB.findByIdAndDelete(dbChild._id);
            Helper.fMsg(res, "Deleted Child Category");
        } else {
            next(new Error("No Child Cat with that id"));
        }

    } else {
        next(new Error("No Child Cat with that id"));
    }
}
const patch = async(req,res,next)=>{
    const dbChild = await DB.findById(req.params.id);
    if(dbChild){
        await DB.findByIdAndUpdate(dbChild._id,req.body);
        let result = await DB.findById(dbChild._id);
        Helper.fMsg(res,"Updated Child Category", result);
    }
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}