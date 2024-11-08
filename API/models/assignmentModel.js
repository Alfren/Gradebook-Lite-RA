import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Assignment = sequelize.define("Assignment", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("Homework", "Quiz", "Exam", "Project"),
    allowNull: false,
  },
  assignedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
  extraCredit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
