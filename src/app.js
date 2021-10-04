require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cookie_parser = require("cookie-parser");

const path = require("path");

const hbs = require("hbs");
require("./db/conn");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
const authToken = require("../middleware/authentication.jwt");

app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cookie_parser());
//setting routes

app.use("/api/category", authToken, require("./routes/category_router"));
app.use("/api/company", authToken, require("./routes/company_router"));
app.use("/", require("../src/routes/home_router")); //home route
app.use("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
