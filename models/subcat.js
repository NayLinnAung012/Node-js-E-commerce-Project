const mongoose = require('mongoose');
const { Schema } = mongoose;
const subcatSchema = new Schema({
    name: { type: String, required: true, uniqued: true },
    image: { type: String, required: true },
    catId: { type: Schema.Types.ObjectId, ref: 'category' },
    childcats: [{ type: Schema.Types.ObjectId, ref: 'childcats' }],
    created: { type: Date, default: Date.now }
});
const subCat = mongoose.model('subcats', subcatSchema);
module.exports = subCat;