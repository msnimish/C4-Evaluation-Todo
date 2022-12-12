require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const userID = decoded.userID;
        req.body.userID = userID;
        next();
      } else {
        res.send({ msg: "Please Login" });
      }
    } catch (err) {
      console.log(err);
      res.send({ err: "Something went wrong" });
    }
  } else {
    res.send({ msg: "Please Login" });
  }
};

module.exports = { authenticate };
