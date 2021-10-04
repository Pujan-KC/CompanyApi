const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  try {
    const UserAuthToken = req.cookies.AuthToken;

    const Userinfo = jwt.verify(UserAuthToken, process.env.KEY);
    if (Userinfo.username == "Ekbana" && Userinfo.password == "DummyPassword") {
      next();
    } else {
      res.status(401).json({
        message: "unauthorized Access Go to API login to login and get access",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "unauthorized Access Go to API/login to login and get access",
    });
  }
};
module.exports = authToken;
