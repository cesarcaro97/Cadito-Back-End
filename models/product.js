const mongoose = require('mongoose');

const ProductScheme = new mongoose.Schema(
    {
        description: {
            type: String,
            default: null
        },
        display_name: {
            type: String,
            default: null
        },
        img_url: {
            type: String,
            default: null
        },
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        price: {
            type: Number,
            default: 0
        },

    },
); 

module.exports = mongoose.model('products', ProductScheme);