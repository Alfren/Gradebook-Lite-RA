const router = require("express").Router();
const studentModel = require("./studentModel");
const classModel = require("../class/classModel");

router.get("/", async function (req, res) {
  try {
    const response = await studentModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const response = await studentModel.find({ teacherId });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await studentModel.create({ ...body, grades: {} });
    await classModel.findByIdAndUpdate(
      body.classId,
      { $push: { students: response.id } },
      { safe: true, upsert: true, new: true }
    );
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
    const response = await studentModel.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/:id/class/:classId", async function (req, res) {
  const {
    params: { id, classId },
  } = req;
  try {
    const response = await studentModel.findByIdAndDelete(id);
    await classModel.findByIdAndUpdate(
      classId,
      { $pull: { students: id } }
      // { safe: true, upsert: true, new: true }
    );
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
