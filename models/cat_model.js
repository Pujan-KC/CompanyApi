const mongoose = require("mongoose");

const catScema = new mongoose.Schema(
  {
    _id: { type: Number, maxLength: 11 },

    title: {
      trim: true,
      type: String,
      required: true,
      maxLength: 255,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
  { _id: false }
);
//pre method to create a custom unique INTEGER id
catScema.pre("save", function (next) {
  CatModel.find({}, (err, data) => {
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

module.exports = CatModel = new mongoose.model("Category", catScema);
