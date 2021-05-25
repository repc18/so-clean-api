const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    worker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker"
    }],
    timeslot: Array,
    workersAmount: Number
},{
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;