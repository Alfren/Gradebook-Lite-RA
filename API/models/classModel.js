import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Class = sequelize.define("Class", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { Class };
