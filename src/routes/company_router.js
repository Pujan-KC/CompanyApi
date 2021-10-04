const express = require("express");
const router = express.Router();
const {
  CompanyIndex,
  CreateCompany,
  ComapanyDetail,
  DeleteCompany,
  UpdateCompanyData,
} = require("../../controller/company_control");
//Company Index of 10
router.get("/", CompanyIndex);
//Comapany Detail
router.get("/:_id", ComapanyDetail);
//Creating Company
router.post(
  "/",
  require("../../middleware/form_validator_middleware"),
  CreateCompany
);
//Deleting Company Data
router.delete("/:_id", DeleteCompany);
//Updating Company Data
router.put(
  "/:_id",
  require("../../middleware/form_validator_middleware"),
  UpdateCompanyData
);

module.exports = router;
