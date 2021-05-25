const orders = require("../controllers/orderController");
const router = require("express").Router();

module.exports = app => {
    // Retrieve all orders
    router.get("/", orders.findAll);

    // Retrieve order with the specified id
    router.get("/:id", orders.findOne);

    // Update order with the specified id
    router.put("/:id", orders.update);

    // Delete all orders
    router.delete("/", orders.deleteAll);

    // Delete order with the specified id
    router.delete("/:id", orders.delete);
}