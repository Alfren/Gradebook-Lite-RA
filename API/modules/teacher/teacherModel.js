const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const findOrCreate = require("mongoose-findorcreate");

const TeacherSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    classes: {
      type: Array,
      default: [],
    },
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
TeacherSchema.plugin(findOrCreate);

module.exports = Teacher = mongoose.model("Teacher", TeacherSchema);
