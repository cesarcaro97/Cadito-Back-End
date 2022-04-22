const mongoose = require('mongoose');

const CartScheme = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

    },
); 

module.exports = mongoose.model('cart', CartScheme);