import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Teacher = sequelize.define("Teacher", {
  username: {
    type: DataTypes.STRING,
    required: true,
  },
});

export { Teacher };
