import { Router } from "express";
import { Student, Class } from "../models/index.js";

export const StudentRouter = Router();

StudentRouter.get("/", async function (req, res) {
  try {
    const response = await Student.findAll();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

StudentRouter.get("/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const response = await Student.findAll({ where: { teacherId } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

StudentRouter.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await Student.create(body);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

StudentRouter.patch("/:id", async function (req, res) {
  const { body } = req;
  const { id } = req.params;
  try {
    const response = await Student.update(body, { where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

StudentRouter.delete("/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const response = await Student.destroy({ where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});
