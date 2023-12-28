const mongoose = require('mongoose');
const { Schema } = mongoose;
const ChildCatSchema = new Schema({
    name: { type: String, required: true, uniqued: true },
    image: { type: String, required: true },
    subcatId: { type: Schema.Types.ObjectId, ref: 'subcats' },
    created: { type: Date, default: Date.now }
});
const childCats = mongoose.model('childcats',ChildCatSchema);
module.exports = childCats;