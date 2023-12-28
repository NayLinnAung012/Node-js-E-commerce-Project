const mongoose = require('mongoose');
const { Schema } = mongoose;
const DeliverySchema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    remark: { type: Array },
    created: { type: Date, default: Date.now }
});
const delivery = mongoose.model('delivery',DeliverySchema);
module.exports = delivery;