const User = require("../models/userModel");
const generateToken = require("../../generateToken");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
exports.register = async (req, res) => {
  // Validate create user request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a new user
  const user = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    paymentMethod: req.body.paymentMethod,
    area: req.body.area,
  };

  // Check if the user already exists
  const UserExists = await User.findOne({ email: user.email });
  if (UserExists) {
    res.status(400).send("User already exists");
    return;
  }

  // Hash the user password
  bcrypt.hash(user.password, 10, (err, hashed) => {
    if (err) console.log(err);
    const newUser = {
      ...user,
      password: hashed,
    };
    User.create(newUser, (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
exports.authUser = async (req, res) => {
  const userInput = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await User.findOne({ email: userInput.email });

  if (user) {
    bcrypt.compare(userInput.password, user.password, (err, result) => {
      if (err) console.log(err);
      res.json({
        _id: user._id,
        name: user.name,
        address: user.address,
        area: user.area,
        email: user.email,
        phone: user.phone,
        paymentMethod: user.paymentMethod,
        token: generateToken(user._id),
      });
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

async function fetchData(url, data) {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // console.log(response);
    // res = await response.json();
    // console.log("RES: ", res);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// @desc    Enable user to create order
// @route   GET /api/users/createOrder
// @access  Private
exports.createOrder = async (req, res) => {
  const useScheduleURL =
    "https://soclean-backend.herokuapp.com/api/use_schedule";
  const addOrderURL = "https://soclean-backend.herokuapp.com/api/add_order";
  const orderDetails = req.body.orderDetails;
  const user = await User.findById(req.user._id);
  if (user) {
    const orderData = {
      areaAddress: req.body.area,
      workersAmount: orderDetails.workersAmount,
      date: orderDetails.date,
      startingHour: req.body.startingHour,
      endingHour: req.body.endingHour,
    };
    try {
      const workerResponse = await fetchData(useScheduleURL, orderData);
      console.log("Worker Response: ", workerResponse);
    } catch (error) {
      console.error(error);
    }
    const workers = workerResponse.workerIds.map((worker) => worker.$oid);
    const newOrder = {
      customerId: user._id,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      address: req.body.address,
      area: req.body.area,
      workerIds: workers,
      date: orderDetails.date,
      workersAmount: orderDetails.workersAmount,
      price: orderDetails.price,
      shift: orderDetails.shift,
      paymentMethod: orderDetails.paymentMethod,
      manhour: orderDetails.manhour,
    };
    try {
      const result = await fetchData(addOrderURL, newOrder);
      console.log("Result: ", result);
      res.json(result);
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(404);
    return new Error("User not found");
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      address: user.address,
      email: user.email,
      phone: user.phone,
      paymentMethod: user.paymentMethod,
    });
  } else {
    res.status(404);
    return new Error("User not found");
  }
};

// Retrieve all users from the database
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.findAll = (req, res) => {
  User.find((err, users) => {
    if (err) console.log(err);
    res.json(users);
  });
};

// Find a single user
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.findOne = async (req, res) => {
  const id = req.params.id;
  let user = null;
  try {
    user = await User.findById(id).exec();
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some error occurred while retrieving user.",
    });
  }
  if (!user) {
    return res.status(404).send({
      message: "User not found.",
    });
  }
  return res.json(user);
};

// @desc    Update user by the id
// @route   PUT /api/users/
// @access  Private/Admin
exports.update = async (req, res) => {
  const id = req.user._id;
  let body = req.body;
  if (body.password) {
    let password = await bcrypt.hash(body.password, 10);
    body = {
      ...body,
      password,
    };
  }
  User.findByIdAndUpdate(id, body, { new: true }, (err, user) => {
    if (err) console.log(err);
    res.send(user);
  });
};

// @desc    Delete a user with the specified id in the user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id, {}, (err, result) => {
    if (err) console.log(err);
    res.send(`User with id ${id} deleted succesfully.`);
  });
};

// Delete all users in the database
// @desc    Delete users
// @route   DELETE /api/users/
// @access  Private/Admin
exports.deleteAll = (req, res) => {
  User.deleteMany({}, {}, (err) => {
    if (err) console.log(err);
    res.send("All users are deleted.");
  });
};
