//require("dotenv").config();

//const jwt = require("jsonwebtoken");
//const User = require("../model/Users");

//const authMiddleware = async (req, res, next) => {
// const token = req.header("Authorization");

//if (!token) {
// return res.status(401).json({ msg: "No token, authorization denied" });
// }

//try {
// const formattedToken = token.replace("Bearer ", "");
// const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET);

// req.user = await User.findById(decoded.id).select("-password");
// next();
//} catch (err) {
//  if (err.name === "TokenExpiredError") {
//  return res.status(401).json({ msg: "Token expired" });
// } else if (err.name === "JsonWebTokenError") {
//  return res.status(401).json({ msg: "Token is not valid" });
//} else {
// return res.status(500).json({ msg: "Server error" });
// }
// }
//};

//module.exports = authMiddleware;
