const asyncHandeler = require("express-async-handler");
const { User, validateUpdateUser } = require("../model/user");
const bcrypt = require("bcryptjs");
const getAllUsers = asyncHandeler(async (req, res) => {
  const users = await User.find();
  if (!users.length) {
    return res.status(404).json({ message: "there are not users" });
  }
  res.status(200).json(users);
});
const getUserById = asyncHandeler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) return res.status(200).json(user);
  res.status(404).json({ message: "user not fount" });
});
const updateUser = asyncHandeler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { error } = validateUpdateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "user not found" });
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const newUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: req.body.password,
      },
    },
    {
      new: true,
    }
  );
  res.status(201).json({ message: "user updated successfuly", newUser });
});
const deleteUser = asyncHandeler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "user deleted successfuly" });
  }
  res.status(404).json({ message: "user not found" });
});
module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
