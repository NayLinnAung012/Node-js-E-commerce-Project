const DB = require('../models/subcat');
const CatDB = require('../models/category');
const Helper = require('../utils/helper');
const all = async (req, res, next) => {
    let result = await DB.find().populate('childcats');
    Helper.fMsg(res, "All SubCategories.", result);
}
const get = async (req, res, next) => {
    let dbSub = await DB.findById(req.params.id);
    if (dbSub) {
        Helper.fMsg(res, "Single subCategory", dbSub)
    } else {
        next(new Error("Subcat with that id does't exis"))
    }
}
const add = async (req, res, next) => {
    let dbSubCat = await DB.findOne({ name: req.body.name });
    if (dbSubCat) {
        next(new Error("This Subcat is already in used"));
    } else {
        let dbCat = await CatDB.findById(req.body.catId);
        if (dbCat) {
            let result = await new DB(req.body).save();
            await CatDB.findByIdAndUpdate(dbCat._id, { $push: { subcats: result._id } });
            Helper.fMsg(res, "New subCategory added.", result);
        }

    }
}
const drop = async (req, res, next) => {
    let dbSub = await DB.findById(req.params.id);
    if (dbSub) {
        await CatDB.findByIdAndUpdate(dbSub.catId, { $pull: { subcats: dbSub._id } });
        await DB.findByIdAndDelete(dbSub._id);
        Helper.fMsg(res, "SubCat Dropped")
    } else {
        next(new Error("This SubCat id doesn't exis"))
    }
}
const patch = async (req, res, next) => {
    let dbSub = await DB.findById(req.params.id);
    if (dbSub) {
        await DB.findByIdAndUpdate(dbSub._id, req.body);
        let result = await DB.findById(dbSub._id);
        Helper.fMsg(res, "Subcategory Updated", result);
    } else {
        next(new Error("NO Subcat with that id"));
    }
}
module.exports = {
    all,
    add,
    drop,
    get,
    patch
}