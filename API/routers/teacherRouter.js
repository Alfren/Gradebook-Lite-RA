import { Router } from "express";
import { Teacher, Class } from "../models/index.js";

export const TeacherRouter = Router();

TeacherRouter.get("/", async function (req, res) {
  try {
    const response = await Teacher.find();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

TeacherRouter.get("/:username", async function (req, res) {
  const { username } = req.params;
  try {
    const response = await Teacher.findOne({
      where: { username },
      include: [{ model: Class }],
    });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

TeacherRouter.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await Teacher.create(body);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

TeacherRouter.patch("/:id", async function (req, res) {
  const { id } = req.params;
  const { body } = req;
  try {
    const response = await Teacher.update(body, { where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

TeacherRouter.delete("/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const response = await Teacher.destroy({ where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

TeacherRouter.delete("/complete/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    await Class.destroy({ where: { teacherId } });
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});
