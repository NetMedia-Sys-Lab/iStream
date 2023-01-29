const router = require("express").Router();
const controller = require("../controllers/experiment.controller");

router.get("/getUserExperimentsList", controller.getUserExperimentsList);
router.get("/getExperimentConfig", controller.getExperimentConfig);
router.get("/getExperimentData", controller.getExperimentData);
router.get("/downloadExperimentResults", controller.downloadExperimentResults);
router.get("/getExperimentResults", controller.getExperimentResults);
router.get("/downloadResult", controller.downloadResult);


router.post("/create", controller.createNewExperiment);
router.post("/deleteExperiment", controller.deleteExperiment);
router.post("/deleteResult", controller.deleteResult);
router.post("/duplicateExperiment", controller.duplicateExperiment);

module.exports = router;
