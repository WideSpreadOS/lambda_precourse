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
    phone: String,
    city: String,
    state: String,
    country: String,
    engineer_level: Number,
    profile_image: String,
    fav_color: String,
    bio: String,
    ui_mode: String,
    social: {
            slack: String,
            zoom: String,
            github: String,
            linkedin: String,
            stack_overflow: String,
            widespread: String
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;