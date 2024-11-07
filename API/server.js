import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "*" : "https://gradegenie.org",
  })
);

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

const { StudentRouter } = await import("./routers/studentRouter.js");
const { AssignmentRouter } = await import("./routers/assignmentRouter.js");
const { TeacherRouter } = await import("./routers/teacherRouter.js");
const { ClassRouter } = await import("./routers/classRouter.js");

const MainRouter = express.Router();
MainRouter.use("/students", StudentRouter);
MainRouter.use("/assignments", AssignmentRouter);
MainRouter.use("/teachers", TeacherRouter);
MainRouter.use("/classes", ClassRouter);

app.use("/api", MainRouter);

// catch all route handler
app.use((req, res) => {
  res.status(404).send("Not Found. Try Again.");
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
