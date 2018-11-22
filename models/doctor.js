const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: { type: String, required: [true, 'The name of doctor is mandatory'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ref User Schema
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'The id of hospital is mandatory'] }, // ref Hospital Schema
});


module.exports = mongoose.model('Doctor', doctorSchema);