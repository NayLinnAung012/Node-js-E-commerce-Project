const mongoose = require('mongoose');
const { Schema } = mongoose;
const warrantySchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    remark: { type: Array },
    created: { type: Date, default: Date.now }
});
const warranty = mongoose.model('warranty',warrantySchema);
module.exports = warranty;