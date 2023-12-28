const DB = require('../models/order');
const OrderItemDB = require('../models/orderitem');
const ProductDB = require('../models/product');
const Helper = require('../utils/helper');

const add = async(req,res,next)=>{
    let user = req.user;
    let items = req.body.items;
    let total = 0;
    let saveOrder = new DB();
    let orderItemObj = [];
    for await (let item of items){
        let product = await ProductDB.findById(item.id);
        let obj = {
            order: saveOrder._id,
            count: item.count,
            productId:product._id,
            name:product.name,
            price:product.price
            
        }
        orderItemObj.push(obj);
        total += product.price*item.count;
    }
    let orderItemResults = await OrderItemDB.insertMany(orderItemObj);
    // console.log(orderItemResults);
    let orderItemIds = orderItemResults.map(item => item._id);

    saveOrder.user = req.user;
    // console.log(req.user);
    saveOrder.items = orderItemIds;
    saveOrder.count = items.length;
    saveOrder.total = total;
    let result = await saveOrder.save();
    Helper.fMsg(res,"Order Accepted",result);

}
const myOrder = async(req,res,next)=>{
    let authUser = req.user;
    const result = await DB.find({user:authUser._id}).populate('items');
    Helper.fMsg(res,"Particular User's Order",result);
}
module.exports = {
    add,
    myOrder
}