const protectingMiddleware = require("../controllers/protectRouteMiddleware");
const users = require("../controllers/userController");
const router = require("express").Router();

module.exports = (app) => {
  // Create a new user
  router.post("/", users.register);

  // Retrieve all users
  router.get("/", users.findAll);

  // Update a single user by id
  router.put("/", protectingMiddleware, users.update);

  // Authenticate user
  router.post("/login", users.authUser);

  // Create new order
  router.post("/createOrder", protectingMiddleware, users.createOrder);

  // Retrieve user's profile
  router.get("/profile", protectingMiddleware, users.getUserProfile);

  // Retrieve a single user by id
  router.get("/:id", users.findOne);

  // Delete a single user by id
  router.delete("/:id", users.delete);

  // Delete all users
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
