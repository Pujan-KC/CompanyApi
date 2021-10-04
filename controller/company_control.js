const CompModel = require("../models/company_model");
const CatModel = require("../models/cat_model");

const fs = require("fs-extra");
const { validationResult } = require("express-validator");

//Company index with title and pagination
const CompanyIndex = async (req, res) => {
  try {
    var skip = 0;
    //For Pagination
    if (req.query) {
      page = parseInt(req.query.page, 10);
      if (page > 1) {
        page--;
        //exclude previous 10 datas;
        skip = page * 10;
      }
    }
    var count = await CompModel.countDocuments();
    const companies = await CompModel.find({})
      .limit(10)
      .skip(skip)
      .select({ _id: 0, title: 1, category_id: 1 });
    const message = `Showing ${skip} to ${skip + 10} of ${count} Companies `;
    res.status(200).json({ message: message, data: companies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//Single Company Detail
const ComapanyDetail = async (req, res) => {
  try {
    console.log("hit");
    var { _id } = req.params;
    if (isNaN(_id)) return res.status(400).json({ message: "bad request" });
    const CompDetail = await CompModel.findOne({ _id });
    if (!CompDetail) {
      return res.status(404).json("Resource not Found");
    }
    var catDetail;
    if (CompDetail.cagetgory_id != "") {
      catDetail = await CatModel.findOne({
        _id: CompDetail.category_id,
      });
    }
    res
      .status(200)
      .json({ CompanyDetail: CompDetail, CategoryDetail: catDetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//Adding new company data
const CreateCompany = async (req, res) => {
  try {
    var filemessage = "";
    //Errors  from express Validator if exists
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ formValidationError: errors });
    }
    const tempData = new CompModel(req.body);
    const result = await tempData.save();
    //if image is uploaded
    if (req.files) {
      const { image } = req.files;
      // An array that holds type and extension of MIME file
      const type = image.mimetype.split("/");
      //if image is valid
      if (type.includes("image")) {
        const { _id } = result;
        imageName = _id + "." + type[1];
        await image.mv("public/images/company_avatar/" + imageName);
        await CompModel.findByIdAndUpdate(
          { _id },
          { $set: { image: imageName } }
        );
        filemessage = " and Image uploaded successfully";
      }
      //if image is invalid
      else {
        return res.status(400).json({ message: " invalid Image Privided" });
      }
    }
    res
      .status(201)
      .json({ message: `Company Data Created ${filemessage}`, result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Deleting Company Data
const DeleteCompany = async (req, res) => {
  try {
    var { _id } = req.params;
    if (isNaN(_id)) return res.status(400).json({ message: "bad request" });
    const CompDetail = await CompModel.findOne({ _id });
    //if Company Detail Does not exists
    if (!CompDetail) {
      return res.status(404).json({ message: "Resource not Found" });
    }
    //if Image exists in database
    if (CompDetail.image) {
      fs.remove(`public/images/company_avatar/${CompDetail.image}`, (err) => {
        if (err) console.log(err);
      });
    }
    result = await CompModel.findByIdAndDelete({ _id });
    res
      .status(200)
      .json({ message: "Company Details  Deleted", DeletedItem: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Updating Company data
const UpdateCompanyData = async (req, res) => {
  try {
    const { _id } = req.params;
    if (isNaN(_id)) return res.status(400).json({ message: "bad request" });
    const CompData = await CompModel.findOne({ _id });
    if (!CompData) {
      return res.status(404).json({ message: "Company Data Not found" });
    }
    req.body.title = req.body.title.trim();
    var message = "";
    //if image is updated
    if (req.files) {
      const { image } = req.files;
      //getting type and extension array of file
      const type = image.mimetype.split("/");
      //if image is valid delete old image and add new image
      if (type.includes("image")) {
        var message = "";
        req.body.image = _id + "." + type[1];
        //if previous image exists remove image
        if (CompData.image) {
          fs.remove(`public/images/avatar/${CompData.image}`, (err) => {
            if (err) console.log(err);
            else {
              message = "Image Deleted and ";
            }
          });
        }
        image.mv("public/images/cat_images/" + req.body.image, (err) => {
          if (err) console.log(err);
          else {
            message += "Image Updated";
          }
        });
      }
      //if image is invalid
      else {
        var message = "Invalid Image file. Image not modified";
      }
    }
    const updateInfo = await CompModel.findByIdAndUpdate(
      { _id },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Details Updated" + message, result: updateInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  CompanyIndex,
  CreateCompany,
  ComapanyDetail,
  DeleteCompany,
  UpdateCompanyData,
};
