const mongoose = require('mongoose');

const HistoryScheme = new mongoose.Schema(
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

module.exports = mongoose.model('histories', HistoryScheme);