const { Router } = require("express");
const studentRoute = require("./student/studentRouter");
const assignmentsRoute = require("./assignment/assignmentRouter");
const router = Router();

const init = () => {
  // *** register routes here *** //
  router.use("/students", studentRoute);
  router.use("/assignments", assignmentsRoute);
  return router;
};

module.exports = { init };
