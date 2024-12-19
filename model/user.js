const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 3,
      maxLength: 30,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const validationRegister = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).trim().required(),
    lastName: Joi.string().min(3).max(30).trim().required(),
    password: Joi.string().min(6).trim().required(),
    email: Joi.string().min(3).max(30).trim().email().required(),
  });
  return schema.validate(obj);
};
const validationLogin = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).trim().required(),
  });
  return schema.validate(obj);
};
const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).trim(),
    lastName: Joi.string().min(3).max(30).trim(),
    password: Joi.string().min(6).trim(),
    email: Joi.string().min(3).max(30).trim().email(),
  });
  return schema.validate(obj);
};
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validationRegister,
  validationLogin,
  validateUpdateUser,
};
