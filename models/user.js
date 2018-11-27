const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// object to control the allowed roles
const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a permitted role'
};

const userSchema = new Schema({
    name: { type: String, required: [true, 'The name is mandatory'] },
    email: { type: String, unique: true, required: [true, 'The email is mandatory'] },
    password: { type: String, required: [true, 'The password is mandatory'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles }, // (enum) to validate permitted role
    google: { type: Boolean, default: false },
});

// to send a message in case of email duplication
userSchema.plugin(uniqueValidator, { message: 'The email must be unique' });

// the model method is given a model name and the data thereof
module.exports = mongoose.model('User', userSchema);