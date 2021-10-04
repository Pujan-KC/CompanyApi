const express = require("express");
const router = express.Router();
const {
  CategoryIndex,
  AddCategory,
  DeleteCategory,
  CategoryDetail,
  UpdateCategory,
} = require("../../controller/category_control");

//get Category Details
router.get("/:_id", CategoryDetail);
//get 10 categories
router.get("/", CategoryIndex);
//add new category
router.post("/", AddCategory);
//delete category
router.delete("/:_id", DeleteCategory);
//update category
router.put("/:_id", UpdateCategory);

module.exports = router;
