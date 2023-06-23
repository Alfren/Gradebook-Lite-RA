const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "Single",
    },
    parts: {
      type: Array,
    },
    teacherId: { type: String, required: true },
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

module.exports = Assignment = mongoose.model("Assignment", AssignmentSchema);
