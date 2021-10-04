const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    res.render("index", { tittle: "HOME" });
    console.log(req.cookies.AuthToken);
  } catch (error) {
    console.log(error);
  }
});
//generating cookie
router.all("/api/login", async (req, res) => {
  try {
    var user = { username: "Ekbana", password: "DummyPassword" };
    const token = jwt.sign(user, process.env.KEY);
    res.cookie("AuthToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 600000),
    });
    res.status(200).json({ message: "You are now logged in As  Ekbana" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
