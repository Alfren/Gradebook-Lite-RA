const mongoose = require("mongoose");
require("dotenv").config();

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
};

const connectDB = () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION, mongoConfig);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    // Exit process with a failure
    process.exit(1);
  }
};

module.exports = connectDB;
