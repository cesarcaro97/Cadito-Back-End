const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            default: 0
        },
        display_name: {
            type: String,
            default: null
        },
        username: {
            type: String,
            default: null
        },
        password: {
            type: String,
            default: null
        },

    },
); 

module.exports = mongoose.model('users', UserScheme);