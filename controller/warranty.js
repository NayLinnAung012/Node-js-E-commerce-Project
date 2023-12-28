const DB = require('../models/warranty');
const Helper = require('../utils/helper');
const all = async (req, res, next) => {
    let result = await DB.find();
    Helper.fMsg(res, 'All Warranty', result);
}
const add = async (req, res, next) => {
    let dbWarranty = await DB.findOne({ name: req.body.name });
    if (dbWarranty) {
        next(new Error('This Warranty already in used'));
    } else {
        req.body.remark = req.body.remark.split(',');
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Added Warranty', result);
    }
}
const get = async (req, res, next) => {
    let dbWar = await DB.findById(req.params.id);
    if (dbWar) {
        Helper.fMsg(res, "Single Warranty", dbWar);
    } else {
        next(new Error("No Warranty with that id"));
    }
}
const drop = async (req, res, next) => {
    let dbWar = await DB.findById(req.params.id);
    if (dbWar) {
        await DB.findByIdAndDelete(dbWar._id);
        Helper.fMsg(res, "Single Warranty");
    } else {
        next(new Error("No Warranty with that id"));
    }
}
const patch = async (req, res, next) => {
    let dbWar = await DB.findById(req.params.id);
    if (dbWar) {
        await DB.findByIdAndUpdate(dbWar._id, req.body);
        let result = await DB.findById(dbWar._id);
        Helper.fMsg(res, "Single Warranty Updated", result);
    } else {
        next(new Error("No Warranty with that id"));
    }
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}