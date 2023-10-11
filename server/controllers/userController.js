const User = require("../models").users;
const jwt = require("jsonwebtoken");
const { createUserValidation } = require("../validations/auth");

exports.getAllUsers = (req, res) => {
  User.findAll().then((users) => {
    if (users.length > 0) res.status(200).json(users);
    else
      res.status(404).json({ success: false, message: "No users found" });
  });
};

exports.getUserById = (req, res) => {
  User.findByPk(req.params.id).then((user) => {
    if (user) res.status(200).json(user);
    else
      res.status(404).json({
        success: false,
        message: "User not found with id = " + req.params.id,
      });
  });
};

exports.createUser = (req, res) => {
  const { error } = createUserValidation(req.body);
  console.log(req.body);

  if (error)
    return res.status(422).json({
      success: false,
      message: error.details[0].message,
    });

  const newUser = {
    user_id: Math.random().toString(36).substring(2, 7),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };


  User.create(newUser)
    .then((user) => {
      const { user_id, name } = user;
      res.status(201).json({
        success: true,
        message: "User created successfully!",
        user: { user_id, name },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error creating user: " + err.message,
      });
    });
};

exports.deleteUser = (req, res) => {
  User.destroy({
    where: { user_id: req.params.id },
  }).then((num) => {
    if (num > 0)
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    else
      res.json({
        success: false,
        message: "User not found with id = " + req.params.id,
      });
  });
};

exports.updateUser = (req, res) => {
  User.update(req.body, {
    where: { user_id: req.params.id },
  })
    .then((num) => {
      if (num > 0)
        res.status(200).json({
          success: true,
          message: "User updated successfully",
        });
      else
        res.status(404).json({
          success: false,
          message: "User not found with id = " + req.params.id,
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error updating user with id = " + req.params.id,
        err: err.message,
      });
    });
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } });
    if (user) {
      if (password === user.password) {
        const token = jwt.sign(
          {
            id: user.user_id,
            name: user.name,
            isAdmin: user.isAdmin,
          },
          "secret-key-12345",
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          token: token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Wrong password",
        })
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    next(err);
  }
};
