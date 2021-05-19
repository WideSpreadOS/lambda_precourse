const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    role: Number,
    fname: String,
    lname: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: Date,
    city: String,
    state: String,
    country: String,
    engineer_level: Number,
    profile_image: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;