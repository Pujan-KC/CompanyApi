const { check, validationResult } = require("express-validator");

module.exports = [
  check("title")
    .isString()
    .trim()
    .isLength({ max: 255, min: 1 })
    .withMessage("Tittle Text must be provided"),
  check("status")
    .notEmpty()
    .isBoolean()
    .withMessage("Must provide company status  be true or false")
    .toBoolean(),
];
