const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routerConfig = require("./modules/route");
const { logger } = require("./helpers/logger");
const connectDB = require("./db");

const setupStandardMiddlewares = (app) => {
  // parse requests of content-type - application/json
  app.use(bodyParser.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  return;
};

const configureApiEndpoints = (app) => {
  app.use("/api", routerConfig.init());
  // routerConfig.init(app);
  // define a route handler for the default home page
  app.get("/", (req, res) => {
    res.send("Welcome to express-create application! ");
  });
};

const init = async () => {
  // *** express instance *** //
  connectDB();
  const app = express();
  setupStandardMiddlewares(app);
  if (process.env.NODE_ENV === "development") {
    // Logging responses to console
    app.use((req, res, next) => {
      let send = res.send;
      res.send = (c) => {
        console.log("Body: ", req.body);
        console.log("Code:", res.statusCode);
        res.send = send;
        return res.send(c);
      };
      next();
    });
  }
  configureApiEndpoints(app);
  app.listen(process.env.PORT, async () => {
    try {
      // Setup Secrets from Secrets Manager
      // const secrets = await retrieveSecrets("losthorizon");
      // Object.keys(secrets).forEach((key) => {
      //   if (!(key in process.env)) process.env[key] = secrets[key];
      // });
      // if (process.env.NODE_ENV === "development") console.log(secrets);
    } catch (error) {
      console.log("Error in setting environment variables", error);
      process.exit(-1);
    }
  });
};

init();
