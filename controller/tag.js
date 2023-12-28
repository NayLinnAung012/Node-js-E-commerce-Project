const DB = require('../models/tag');
const Helper = require('../utils/helper');
const { saveSingleFile } = require('../utils/gallery');
const all = async (req, res) => {
    let dbTag = await DB.find();
    Helper.fMsg(res, "All Tags", dbTag);
}
const add = async (req, res, next) => {
    let dbTag = await DB.findOne({ name: req.body.name });
    if (dbTag) {
        next(new Error("This Tag is already in used"));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Added Tag", result);
    }
}
const get = async (req, res, next) => {
    let result = await DB.findById(req.params.id);
    if (result) {
        Helper.fMsg(res, "Get Single Tag", result);
    } else {
        next(new Error("No Tag with that id"));
    }
}
const drop = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id);
    if (dbTag) {
        await DB.findByIdAndDelete(dbTag._id);
        Helper.fMsg(res, "Deleted Tag");
    } else {
        next(new Error("No Tag with that id"));
    }
}
const patch = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id);
    if (dbTag) {
        await DB.findByIdAndUpdate(dbTag._id, req.body);
        let result = await DB.findById(dbTag._id);
        Helper.fMsg(res, 'Updated Tag', result);
    } else {
        next(new Error("No Tag with that id"));
    }
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}