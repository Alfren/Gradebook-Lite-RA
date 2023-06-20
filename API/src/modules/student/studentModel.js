const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    grades: {
      type: Object,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

module.exports = Student = mongoose.model("Student", StudentSchema);
