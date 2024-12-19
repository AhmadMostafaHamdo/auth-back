require("dotenv").config();
const connectToDB = require("./config/db");
const express = require("express");
const mongoose = require("mongoose");
const optionsCors = require("./config/optionsCors");
const cookieparser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const path = require("path");
app.use(cors(optionsCors));
// connect to db
connectToDB();
app.use(cookieparser());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "page not found" });
  } else {
    res.type("txt").send("page not found");
  }
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
