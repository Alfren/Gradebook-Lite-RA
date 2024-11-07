import { Sequelize } from "sequelize";
import { isDev } from "../utils/tools.js";

var sequelize = isDev
  ? new Sequelize({
      schema: "private",
      database: "Gradebook",
      username: "postgres",
      password: "admin",
      host: "localhost",
      port: 5432,
      dialect: "postgres",
      // logging: console.debug,
      logging: false,
    })
  : new Sequelize({
      database: process.env.POSTGRES_DATABASE,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      schema: "private",
      host: process.env.POSTGRES_SERVER,
      port: 5544,
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
    });

export default sequelize;
