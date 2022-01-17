const router = require("express").Router();
const controller = require("../controllers/experiment/experiment.controller");

router.post("/create", controller.createNewExperiment);

router.get("/getUserExperimentsList", controller.getUserExperimentsList);

module.exports = router;
