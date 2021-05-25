const protectingMiddleware = require("../controllers/protectRouteMiddleware");
const workers = require("../controllers/workerController");
const router = require("express").Router();

module.exports = app => {
    // Create a new worker
    router.post("/", workers.register);

    // Retrieve all workers
    router.get("/", workers.findAll);

    // Update a single worker by id
    router.put("/", protectingMiddleware, workers.update);

    // Authenticate worker
    router.post("/login", workers.authWorker);

    // Retrieve worker's profile
    router.get("/profile", protectingMiddleware, workers.getWorkerProfile);

    // Retrieve a single worker by id
    router.get("/:id", workers.findOne);

    // Delete a single worker by id
    router.delete("/:id", workers.delete);

    // Delete all workers
    router.delete("/", workers.deleteAll);

    app.use("/api/workers", router);
}