const DB = require('../models/product');
const Helper = require('../utils/helper');
const add = async (req, res, next) => {
    let dbProduct = await DB.findOne({ name: req.body.name });
    if (dbProduct) {
        next(new Error("This Product is already in used"));
    } else {
        req.body.features = req.body.features.split(',');
        req.body.delivery = req.body.delivery.split(',');
        req.body.warranty = req.body.warranty.split(',');
        req.body.colors = req.body.colors.split(',');
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "Product Saved", result);
    }
}
const paginate = async (req, res) => {
    let reqPage = Number(req.params.page);
    let limit = Number(process.env.PAGE_LIMIT);
    let pageNo = reqPage == 1 ? 0 : reqPage - 1;
    let skipCount = pageNo * limit;
    const result = await DB.find().skip(skipCount).limit(limit);
    Helper.fMsg(res, `Product Page Number ${reqPage}`, result);
}
const get = async(req,res,next)=>{
    const dbProduct = await DB.findById(req.params.id);
    if(dbProduct){
        const result = await DB.findById(dbProduct._id);
        Helper.fMsg(res,"Single Product",result);
    }else{
        next(new Error("No Product with that id"));
    }
}
const drop = async(req,res,next)=>{
    const dbProduct = await DB.findById(req.params.id);
    if(dbProduct){
        await DB.findByIdAndDelete(dbProduct._id);
        Helper.fMsg(res,"Deleted Single Product");
    }else{
        next(new Error("No Product with that id"));
    }
}
const patch = async(req,res,next)=>{
    const dbProduct = await DB.findById(req.params.id);
    if(dbProduct){
        await DB.findByIdAndUpdate(dbProduct._id,req.body);
        const result = await DB.findById(dbProduct._id);
        Helper.fMsg(res,"Updated Single Product", result);
    }else{
        next(new Error("No Product with that id"));
    }
}
const filterBy = async (req, res) => {
    let reqPage = Number(req.params.page);
    let limit = Number(process.env.PAGE_LIMIT);
    let pageNo = reqPage == 1 ? 0 : reqPage - 1;
    let skipCount = pageNo * limit;
    let type = req.params.type;
    let filterType = 'cat';
    switch(type){
        case 'cat' : filterType = 'cat' ; break;
        case 'tag' : filterType = 'tag' ; break;
        case 'subcat' : filterType = 'subcat' ; break;
        case 'childcat' : filterType = 'childcat' ; break;
    }
    // filterType = {filterType:req.params.id};
    let filterObj = {};
    filterObj[`${filterType}`] = req.params.id; //Generate Key
    const result = await DB.find(filterObj).skip(skipCount).limit(limit);
    Helper.fMsg(res, `Product Page Number ${reqPage}`, result);
}

module.exports = {
    add,
    paginate,
    get,
    drop,
    patch,
    filterBy
    
}