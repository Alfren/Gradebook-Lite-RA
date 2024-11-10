import { Router } from "express";
import {
  Class,
  Student,
  Assignment,
  Teacher,
  AssignmentGroup,
} from "../models/index.js";

export const ClassRouter = Router();

ClassRouter.get("/", async function (req, res) {
  try {
    const response = await Class.findAll();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

ClassRouter.get("/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const response = await Class.findAll({
      where: { teacherId },
      include: [
        { model: Student, as: "students" },
        {
          model: AssignmentGroup,
          as: "assignmentGroups",
          include: [{ model: Assignment, as: "assignments" }],
        },
      ],
    });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

ClassRouter.post("/", async function (req, res) {
  const { title, teacherId } = req.body;
  try {
    const response = await Class.create({ title, teacherId });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

ClassRouter.patch("/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const response = await Class.update(req.body, { where: { id } });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

ClassRouter.delete("/:id/:teacherId", async function (req, res) {
  const { id, teacherId } = req.params;
  try {
    const response = await Class.destroy({ where: { id, teacherId } });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
