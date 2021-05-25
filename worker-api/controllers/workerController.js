const Worker = require("../models/workerModel");
const generateToken = require("../../generateToken");
const bcrypt = require("bcrypt");

// @desc    Register a new worker
// @route   POST /api/workers
// @access  Private
exports.register = async (req, res) => {
    // Validate create worker request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Register a new worker
    const { name, areaAddress, email, password, phoneNumber, availableHour } = req.body;
    const worker = {
        name,
        areaAddress,
        email,
        password,
        phoneNumber,
        availableHour
    }

    // Check if the worker already registered
    const WorkerExists = await Worker.findOne({email: email});
    if (WorkerExists) {
        res.status(400).send("Worker already registered.");
        return;
    }

    // Hash the worker password
    bcrypt.hash(worker.password, 10, (err, hashed) => {
        if (err) console.log(err);
        const newWorker = {
            ...worker,
            password: hashed
        };
        Worker.create(newWorker, (err, result) => {
            if (err) console.log(err);
            res.send(result);
        });
    });
}

// @desc    Auth worker & get token
// @route   POST /api/workers/login
// @access  Public
exports.authWorker = async (req, res) => {
    const workerInput = {
        email: req.body.email,
        password: req.body.password
    }

    const worker = await Worker.findOne({email: workerInput.email});

    if (worker) {
        bcrypt.compare(workerInput.password, worker.password, (err, result) => {
            if (err) console.log(err);
            res.json({
                _id: worker._id,
                name: worker.name,
                areaAddress: worker.areaAddress,
                email: worker.email,
                phoneNumber: worker.phoneNumber,
                availableHour: worker.availableHour,
                token: generateToken(worker._id)
            });
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
}

// @desc    Get worker profile
// @route   GET /api/workers/profile
// @access  Private
exports.getWorkerProfile = async (req, res) => {
    const worker = await Worker.findById(req.worker._id);
    if (worker) {
        res.json({
            _id: worker._id,
            name: worker.name,
            areaAddress: worker.areaAddress,
            email: worker.email,
            phoneNumber: worker.phoneNumber,
            availableHour: worker.availableHour
        });
    } else {
        res.status(404);
        throw new Error("Worker not found");
    }
}

// Retrieve all workers from the database
// @desc    Get all workers
// @route   GET /api/workers
// @access  Private/Admin
exports.findAll = async (req, res) => {
    Worker.find((err, workers) => {
        if (err) console.log(err);
        res.send(workers);
    });
}

// Find a single worker
// @desc    Get worker by ID
// @route   GET /api/workers/:id
// @access  Private/Admin
exports.findOne = async (req, res) => {
    const id = req.params.id;
    let worker = null;
    try {
        worker = Worker.findById(id).exec();
    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occured when retrieving the worker."
        });
    }
    if (!worker) {
        return res.status(404).send({
            message: "Worker not found."
        });
    }
    return res.send(worker);
}

// Update a workser by the id
// @desc    Update worker
// @route   PUT /api/workers/:id
// @access  Private/Admin
exports.update = async (req, res) => {
    const id = req.worker._id;
    let body = req.body;
    if (body.password) {
        let password = await bcrypt.hash(body.password, 10);
        body = {
            ...body,
            password
        }
    }
    Worker.findByIdAndUpdate(id, body, {}, (err, worker) => {
        if (err) console.log(err);
        res.send(worker);
    });
}

// Delete a worker with the specified id in the worker
// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private/Admin
exports.delete = (req, res) => {
    const id = req.params.id;
    Worker.findByIdAndDelete(id, {}, (err, result) => {
        if (err) console.log(err);
        res.send(`Worker with id ${id} deleted successfully.`);
    });
}

// Delete all workers in the database
// @desc    Delete workers
// @route   DELETE /api/workers/
// @access  Private/Admin
exports.deleteAll = (req, res) => {
    Worker.deleteMany({}, {}, (err) => {
        if (err) console.log(err);
        res.send("All workers are deleted.");
    });
}