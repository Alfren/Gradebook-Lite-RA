import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Student = sequelize.define(
  "Student",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { paranoid: true }
);

const Grade = sequelize.define("Grade", {
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export { Student, Grade };
