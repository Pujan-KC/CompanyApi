const CatModel = require("../models/cat_model");
//Category Index
const CategoryIndex = async (req, res) => {
  try {
    var skip = 0;
    //For Pagination
    if (req.query) {
      var page = parseInt(req.query.page);
      if (page > 1) {
        //skip previous 10 Datas
        page--;
        skip = page * 10;
      }
    }
    //find and select categoires with 10 at max
    const categories = await CatModel.find()
      .select({ title: 1, _id: 0 })
      .limit(10)
      .skip(skip);

    if (!categories.length)
      return res.status(404).json({ message: "no resource found" });
    // if categories are found
    const count = await CatModel.countDocuments({});
    res.status(200).json({
      message: `Showing ${skip} to ${skip + 10} of ${count} categories `,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
//Adding new category
const AddCategory = async (req, res) => {
  try {
    if (req.body.title == "" || !req.body.title) {
      return res.status(400).json({ message: "please provide category title" });
    }
    const ab = new CatModel(req.body);
    var result = await ab.save();
    res
      .status(201)
      .json({ message: "category created successfully", result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Category Detail
const CategoryDetail = async (req, res) => {
  try {
    const { _id } = req.params;
    if (isNaN(_id)) return res.status(400).json({ message: "bad request" });
    const data = await CatModel.findOne({ _id });
    if (data) {
      res.status(200).json({ details: data });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//Delete category
const DeleteCategory = async (req, res) => {
  try {
    const { _id } = req.params;
    //checking if category exists
    const IsExisting = await CatModel.findOne({ _id });
    if (IsExisting) {
      result = await CatModel.findByIdAndDelete({ _id });
      res.status(200).json({ message: "item Deleted", Deleted: result });
    }
    // if Item doesnot Exists
    else {
      res.status(404).json({ message: "Category Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//Update Category
const UpdateCategory = async (req, res) => {
  try {
    var { _id } = req.params;
    if (isNaN(_id)) return res.status(400).json({ message: "bad request" });
    const Exists = await CatModel.findOne({ _id });
    if (!Exists) {
      // if category doesnot exists json  status 404
      return res.status(404).json({ message: "Category Not Found" });
    }
    const result = await CatModel.findByIdAndUpdate(
      { _id },
      { $set: req.body }
    );
    res
      .status(200)
      .json({ message: "category Details Updated", resulet: result });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  CategoryIndex,
  AddCategory,
  DeleteCategory,
  CategoryDetail,
  UpdateCategory,
};
