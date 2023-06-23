const { Router } = require("express");
const studentRoute = require("./student/studentRouter");
const assignmentsRoute = require("./assignment/assignmentRouter");
const teacherRoute = require("./teacher/teacherRouter");
const classRoute = require("./class/classRouter");
const router = Router();

const init = () => {
  // *** register routes here *** //
  router.use("/students", studentRoute);
  router.use("/assignments", assignmentsRoute);
  router.use("/teachers", teacherRoute);
  router.use("/classes", classRoute);
  return router;
};

module.exports = { init };
