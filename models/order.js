const mongoose = require('mongoose');
const { Schema } = mongoose;
const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'orderitem' }],
    count: { type: Number, required: true },
    total: { type: Number, required: true },
    created: { type: Date, default: Date.now }
});
const order = mongoose.model('order',OrderSchema);
module.exports = order;