const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, uniqued:true },
    image: { type: String, required: true },
    subcats: [{ type: Schema.Types.ObjectId, ref: 'subcats' }],
    created: { type: Date, default: Date.now }
});

const Category = mongoose.model('category', CategorySchema);
module.exports = Category;