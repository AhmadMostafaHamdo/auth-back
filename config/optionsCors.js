const allowedOrigin = require("./allowedOrigin");
const optionsCors = {
  origin: "http://localhost:8000",
};
module.exports = optionsCors;
// (origin, callback) => {
//     if (allowedOrigin.indexOf(origin) != -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not Allowed By Cors"));
//     }
//   },
