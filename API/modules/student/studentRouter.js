const router = require("express").Router();
const studentModel = require("./studentModel");

router.get("/", async function (req, res) {
  try {
    const response = await studentModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await studentModel.create(body);
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

router.delete("/:id", async function (req, res) {
  const {
    params: { id },
  } = req;
  try {
    const response = await studentModel.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
