import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Assignment = sequelize.define("Assignment", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(DataTypes.STRING),
    values: ["Single", "Group", "Part"],
    defaultValue: "Single",
  },
  weight: {
    type: DataTypes.INTEGER,
  },
});

const AssignmentGroup = sequelize.define("AssignmentGroup", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

export { Assignment, AssignmentGroup };
