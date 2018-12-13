const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: [true, 'The name of hospital is mandatory'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' } // ref User Schema
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);