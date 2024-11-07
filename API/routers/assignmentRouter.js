import { Router } from "express";
import { Assignment, Class } from "../models/index.js";

export const AssignmentRouter = Router();

AssignmentRouter.get("/", async (req, res) => {
  try {
    const response = await Assignment.findAll();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

AssignmentRouter.get("/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const response = await Assignment.findAll({ where: { teacherId } });
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

AssignmentRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const response = await Assignment.create(body);
    await Class.findByIdAndUpdate(
      body.classId,
      { $push: { assignments: response.id } },
      { safe: true, upsert: true, new: true }
    );
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

AssignmentRouter.patch("/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await Assignment.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

AssignmentRouter.delete("/:id/class/:classId", async (req, res) => {
  const {
    params: { id, classId },
  } = req;
  try {
    const response = await Assignment.findByIdAndDelete(id);
    await Class.findByIdAndUpdate(
      classId,
      { $pull: { assignments: id } }
      // { safe: true, upsert: true, new: true }
    );
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
