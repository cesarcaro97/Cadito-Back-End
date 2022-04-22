const mongoose = require('mongoose');

const ReviewScheme = new mongoose.Schema(
    {
        description: {
            type: String,
            default: null
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        rating: {
            type: Number,
            default: null
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

    },
); 

module.exports = mongoose.model('reviews', ReviewScheme);