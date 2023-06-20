const router = require("express").Router();
const assignmentModel = require("./assignmentModel");

router.get("/", async function (req, res) {
  try {
    const response = await assignmentModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await assignmentModel.create(body);
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
    const response = await assignmentModel.findByIdAndUpdate(id, body);
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
    const response = await assignmentModel.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
