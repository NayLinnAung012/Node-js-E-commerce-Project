const DB = require('../models/category');
const Helper = require('../utils/helper');
const all = async (req, res, next) => {
    let result = await DB.find().populate({
        path: 'subcats',
        populate: {
            path: 'childcats',
            model: 'childcats'
        }
    });
    Helper.fMsg(res, "All Category", result)
}
const get = async (req, res, next) => {
    let result = await DB.findById(req.params.id);
    if (result) {
        Helper.fMsg(res, "Single Category", result);
    } else {
        next(new Error("No Category with that id"));
    }
}
const drop = async (req, res, next) => {
    let dbcat = await DB.findById(req.params.id);
    if (dbcat) {
        await DB.findByIdAndDelete(dbcat._id);
        Helper.fMsg(res, "Deleted Category.")
    } else {
        next(new Error("No Category with that id."))
    }
}
const add = async (req, res, next) => {
    let dbCat = await DB.findOne({ name: req.body.name });
    if (dbCat) {
        next(new Error("This category already in use"))
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Save File!', result);
    }
}
const patch = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        await DB.findByIdAndUpdate(dbCat._id, req.body);
        const result = await DB.findById(dbCat._id);
        Helper.fMsg(res, "Category Updated", result);
    } else {
        next(new Error("No Category with that id"));
    }
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}