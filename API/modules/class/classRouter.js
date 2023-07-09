const router = require("express").Router();
const classModel = require("./classModel");
const studentModel = require("../student/studentModel");
const assignmentModel = require("../assignment/assignmentModel");
const teacherModel = require("../teacher/teacherModel");

router.get("/", async function (req, res) {
  try {
    const response = await classModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const response = await classModel
      .find({ teacherId })
      .populate({ path: "students", select: "_id name grades" })
      .populate({ path: "assignments", select: "_id title type parts" })
      .exec();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const {
    body: { title, teacherId, students, assignments },
  } = req;
  try {
    const newStudents = await Promise.all([
      ...students.map(
        async (name) => await studentModel.create({ name, grades: {} })
      ),
    ]);
    const newAssignments = await Promise.all([
      ...assignments.map(async (entry) => await assignmentModel.create(entry)),
    ]);
    const newClass = await classModel.create({
      title,
      teacherId,
      students: newStudents.map(({ id }) => id),
      assignments: newAssignments.map(({ id }) => id),
    });
    await teacherModel.findByIdAndUpdate(teacherId, {
      $push: { classes: newClass.id },
    });
    res.send();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send(error);
  }
});

router.patch("/:id", async function (req, res) {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await classModel.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/:id/:teacherId", async function (req, res) {
  const {
    params: { id, teacherId },
  } = req;
  try {
    const response = await classModel.findByIdAndDelete(id);
    if (response?.students?.length > 0) {
      await Promise.all([
        ...response.students.map(
          async (id) => await studentModel.findByIdAndDelete(id)
        ),
      ]);
    }
    if (response?.assignments?.length > 0) {
      await Promise.all([
        ...response.assignments.map(
          async (id) => await assignmentModel.findByIdAndDelete(id)
        ),
      ]);
    }
    await teacherModel.findByIdAndUpdate(teacherId, { $pull: { classes: id } });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
