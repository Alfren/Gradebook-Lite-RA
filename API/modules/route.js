const { Router } = require("express");
const studentRoute = require("./student/studentRouter");
const assignmentsRoute = require("./assignment/assignmentRouter");
const teacherRoute = require("./teacher/teacherRouter");
const router = Router();

const init = () => {
  // *** register routes here *** //
  router.use("/students", studentRoute);
  router.use("/assignments", assignmentsRoute);
  router.use("/teachers", teacherRoute);
  return router;
};

module.exports = { init };
