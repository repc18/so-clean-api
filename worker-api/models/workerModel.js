const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: String,
    areaAddress: String,
    email: String,
    password: String,
    phoneNumber: String,
    availableHour: {
        monday: Array,
        tuesday: Array,
        wednesday: Array,
        thursday: Array,
        friday: Array,
        saturday: Array,
        sunday: Array
    }
});

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;