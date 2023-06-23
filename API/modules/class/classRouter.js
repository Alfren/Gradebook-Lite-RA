const router = require("express").Router();
const classModel = require("./classModel");

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
  const { body } = req;
  try {
    const response = await classModel.create(body);
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
    const response = await classModel.findByIdAndUpdate(id, body);
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
    const response = await classModel.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
