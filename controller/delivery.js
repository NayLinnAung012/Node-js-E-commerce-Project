const DB = require('../models/delivery');
const Helper = require('../utils/helper');
const all = async (req, res, next) => {
    const result = await DB.find();
    Helper.fMsg(res, "All Delivery", result);
}
const add = async (req, res, next) => {
    const dbDeli = await DB.findOne({ name: req.body.name });
    if (dbDeli) {
        next(new Error("This Delivery already in used"));
    } else {
        req.body.remark = req.body.remark.split(',');
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Added Delivery", result);
    }
}
const get = async (req, res, next) => {
    const result = await DB.findById(req.params.id);
    if (result) {
        Helper.fMsg(res, 'Single Delivery', result);
    } else {
        next(new Error('No Delivery with that id'));
    }
}
const drop = async (req, res, next) => {
    const result = await DB.findById(req.params.id);
    if (result) {
        await DB.findByIdAndDelete(result._id);
        Helper.fMsg(res, 'Single Delivery Deleted');
    } else {
        next(new Error('No Delivery with that id'));
    }
}
const patch = async (req, res, next) => {
    const dbDellivery = await DB.findById(req.params.id);
    if (dbDellivery) {
        await DB.findByIdAndUpdate(dbDellivery._id, req.body);
        let result = DB.findById(dbDellivery._id);
        Helper.fMsg(res, 'Single Delivery Updated', result);
    } else {
        next(new Error('No Delivery with that id'));
    }
}
module.exports = {
    all,
    add,
    get,
    drop,
    patch
}