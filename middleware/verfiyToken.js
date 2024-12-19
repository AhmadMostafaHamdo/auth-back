const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorize" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) return res.status(403).json({ message: "forbidden" });
    req.user = decoded;
    next();
  });
};
const verfiyIsAdminAndAuthorize = (req, res, next) => {
  if (req.params.id === req.user.id || req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "you are not allowed" });
  }
};

module.exports = { verifyToken, verfiyIsAdminAndAuthorize };
