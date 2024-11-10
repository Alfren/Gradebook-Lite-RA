import { Router } from "express";
import { Assignment, AssignmentGroup, Class } from "../models/index.js";

export const AssignmentRouter = Router();

AssignmentRouter.get("/", async (req, res) => {
  try {
    const response = await Assignment.findAll();
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.get("/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const response = await Assignment.findAll({ where: { teacherId } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const response = await Assignment.create(body);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.patch("/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await Assignment.update(body, { where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Assignment.destroy({ where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.post("/group", async (req, res) => {
  const { body } = req;
  try {
    const response = await AssignmentGroup.create(body);
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.patch("/group/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await AssignmentGroup.update(body, { where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

AssignmentRouter.delete("/group/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await AssignmentGroup.destroy({ where: { id } });
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});
