import { Router } from "express";
import { Class, Student, Assignment, Teacher } from "../models/index.js";

export const ClassRouter = Router();

ClassRouter.get("/", async function (req, res) {
  try {
    const response = await Class.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

ClassRouter.get("/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const response = await Class.findAll({
      where: { teacherId },
      include: [
        { model: Student, as: "students" },
        { model: Assignment, as: "assignments" },
      ],
    });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

ClassRouter.post("/", async function (req, res) {
  const { title, teacherId, students, assignments } = req.body;
  try {
    // Create class, assignments and students related to the class
    const response = await Class.create(
      { title, teacherId, students, assignments },
      {
        include: [
          { model: Student, as: "students" },
          { model: Assignment, as: "assignments" },
        ],
      }
    );
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send(error);
  }
});

ClassRouter.patch("/:id", async function (req, res) {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await Class.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

ClassRouter.delete("/:id/:teacherId", async function (req, res) {
  const {
    params: { id, teacherId },
  } = req;
  try {
    const response = await Class.findByIdAndDelete(id);
    if (response?.students?.length > 0) {
      await Promise.all([
        ...response.students.map(
          async (id) => await Student.findByIdAndDelete(id)
        ),
      ]);
    }
    if (response?.assignments?.length > 0) {
      await Promise.all([
        ...response.assignments.map(
          async (id) => await Assignment.findByIdAndDelete(id)
        ),
      ]);
    }
    await Teacher.findByIdAndUpdate(teacherId, { $pull: { classes: id } });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
