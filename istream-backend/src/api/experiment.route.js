const router = require("express").Router();
const controller = require("../controllers/experiment/experiment.controller");

router.post("/create", controller.createNewExperiment);

module.exports = router;
