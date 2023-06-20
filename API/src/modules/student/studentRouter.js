const router = require("express").Router();
const studentModel = require("./studentModel");

router.get("/", async function (req, res) {
  try {
    const response = await studentModel.find();
    const data = response.map((entry) => {
      entry.id = entry._id;
      delete entry._id;
      return entry;
    });

    res.send(data);
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

module.exports = router;
