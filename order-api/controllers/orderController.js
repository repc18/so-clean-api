const User = require("../../user-api/models/userModel");
const Order = require("../models/orderModel");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/admin
exports.findAll = (req, res) => {
    Order.find((err, orders) => {
        if (err) console.log(err);
        res.json(orders);
    });
}

// @desc    Retrieve the order with the specified id
// @route   GET /api/orders/:id
// @access  Private/admin
exports.findOne = async (req, res) => {
    const id = req.params.id;
    let order = null;
    try {
        order = await Order.findById(id).exec();
    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occurred while retrieving order."
        });
    }
    if (!order) {
        return res.status(404).send({
            message: "Order not found."
        });
    }
    return res.json(order);
}

// @desc    Update the order with the specified id
// @route   PUT /api/orders/:id
// @access  public
exports.update = (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    Order.findByIdAndUpdate(id, updates, {}, (err, order) => {
        if (err) console.log(err);
        res.send(order);
    });
}

// @desc    Delete all of the orders
// @route   DELETE /api/orders
// @access  Private/admin
exports.deleteAll = (req, res) => {
    Order.deleteMany({}, {}, (err) => {
        if (err) console.log(err);
        res.send("All orders are deleted.");
    });
}

// @desc    Delete the order with the specified id
// @route   DELETE /api/orders/:id
// @access  Private/admin
exports.delete = (req, res) => {
    const id = req.params.id;
    Order.findByIdAndDelete(id, {}, (err, result) => {
        if (err) console.log(err);
        res.send(`Order with the id ${id} deleted succesfully.`);
    });
}