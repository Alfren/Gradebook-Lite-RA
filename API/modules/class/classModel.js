const mongoose = require("mongoose");
const studentModel = require("../student/studentModel");
const Schema = mongoose.Schema;

const ClassSchema = new Schema(
  {
    teacherId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
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

module.exports = Class = mongoose.model("Class", ClassSchema);
