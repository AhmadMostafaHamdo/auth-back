const mongoose = require("mongoose");
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToDB;
