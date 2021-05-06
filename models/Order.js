const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Design: {
        type: String,
        required: true
    },
    Qty: {
        type: Number,
        required: true
    },
    UserID: {
        type: String
    }
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);
module.exports = Order;