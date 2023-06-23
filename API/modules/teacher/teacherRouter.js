const router = require("express").Router();
const teacherModel = require("./teacherModel");
const studentModel = require("../student/studentModel");
const assignmentModel = require("../assignment/assignmentModel");

router.get("/", async function (req, res) {
  try {
    const response = await teacherModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/:username", async function (req, res) {
  const { username } = req.params;
  try {
    const response = await teacherModel.findOne({ username });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await teacherModel.create(body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.patch("/:id", async function (req, res) {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await teacherModel.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/:id", async function (req, res) {
  const {
    params: { id },
  } = req;
  try {
    const response = await teacherModel.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/complete/:teacherId", async function (req, res) {
  const {
    params: { teacherId },
  } = req;
  try {
    const studentDocs = await studentModel.find({ teacherId });
    const assignmentDocs = await assignmentModel.find({ teacherId });
    Promise.all([
      ...studentDocs.map(
        async ({ id }) => await studentModel.findByIdAndDelete(id)
      ),
      ...assignmentDocs.map(
        async ({ id }) => await assignmentModel.findByIdAndDelete(id)
      ),
      await teacherModel.findByIdAndDelete(teacherId),
    ])
      .then(() => {
        res.send();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
