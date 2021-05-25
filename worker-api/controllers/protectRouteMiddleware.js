const Worker = require("../models/workerModel");
const jsonwebtoken = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;
            const decoded = jsonwebtoken.verify(token, process.env.JWT_KEY);
            req.worker = await Worker.findById(decoded.id);
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            return new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        return new Error("Not authorized, no token");
    }
}
