const asyncHandeler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validationRegister, validationLogin } = require("../model/user");
const registerController = asyncHandeler(async (req, res) => {
  const { error } = validationRegister(req.body);
  const { firstName, lastName, password, email } = req.body;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(422).json({ message: "this email has been taken" });
  }
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: newPassword,
  });
  await newUser.save();
  const accessToken = jwt.sign(
    { id: newUser._id, isAdmin: newUser.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { id: newUser._id, isAdmin: newUser.isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: "user created successfuly",
    accessToken,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  });
});
const loginController = asyncHandeler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = validationLogin(req.body);
  if (error) {
    return res.status(401).json({ message: error.details[0].message });
  }
  const user = await User.find({ email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  // const passwordIsMatch = await bcrypt.compare(password, user.password);
  // if (!passwordIsMatch) {
  //   return res.status("401").json({ message: "password is not match" });
  // }
  const accessToken = jwt.sign(
    { id: user[0]._id, isAdmin: user[0].isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user[0]._id, isAdmin: user[0].isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "login successed", accessToken });
});
const refresh = asyncHandeler((req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "unauthorize" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "forbidden" });
      }
      const user = await User.findById(decoded.id).exec();
      if (!user) return res.status(401).json({ message: "unauthorize" });
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    }
  );
});
const logout = asyncHandeler((req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "you loged out successfuly" });
});
module.exports = {
  registerController,
  loginController,
  refresh,
  logout,
};
