const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      maxLength: 11,
    },
    category_id: Number,
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    image: { type: String, maxLength: 255 },
    description: { type: String },
    status: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
  { _id: false }
);
//generating Unique Integer Id
CompanySchema.pre("save", function (next) {
  CompModel.find({}, (err, data) => {
    if (err) console.log(err);
    if (!data.length) this_id = 1;
    //Get all Used Ids from database
    var Ids = [];
    for (i = 0; i < data.length; i++) {
      Ids.push(data[i]._id);
    }
    //loop for generating integer id of max length 11
    for (let i = 1; i < 100000000000; i++) {
      //if value of i is unique then _id would be i
      if (!Ids.includes(i)) {
        this._id = i;
        break;
      } else {
        continue;
      }
    }
    next();
  });
});

module.exports = CompModel = new mongoose.model("CompanyDatum", CompanySchema);
