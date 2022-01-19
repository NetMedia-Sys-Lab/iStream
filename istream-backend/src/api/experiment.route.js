const router = require("express").Router();
const controller = require("../controllers/experiment/experiment.controller");

router.post("/create", controller.createNewExperiment);

router.get("/getUserExperimentsList", controller.getUserExperimentsList);

router.post("/deleteExperiment", controller.deleteExperiment);

router.post("/duplicateExperiment", controller.duplicateExperiment);

module.exports = router;
