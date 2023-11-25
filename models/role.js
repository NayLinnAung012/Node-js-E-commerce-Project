const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
    name: { type: String, required: true },
    permits: [{ type: Schema.Types.ObjectId, 'ref': 'permit' }]
});

const role = mongoose.model('role', roleSchema);

module.exports = role;