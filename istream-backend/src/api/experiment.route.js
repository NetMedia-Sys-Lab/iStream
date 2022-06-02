const router = require("express").Router();
const controller = require("../controllers/experiment/experiment.controller");

router.get("/getUserExperimentsList", controller.getUserExperimentsList);
router.get("/getExperimentConfig", controller.getExperimentConfig);
router.get("/getExperimentData", controller.getExperimentData);
router.get("/getUserMachineList", controller.getUserMachineList);
router.get("/getComponentSelectedMachine", controller.getComponentSelectedMachine);
router.get("/downloadExperimentResult", controller.downloadExperimentResult)

router.post("/create", controller.createNewExperiment);
router.post("/deleteExperiment", controller.deleteExperiment);
router.post("/duplicateExperiment", controller.duplicateExperiment);
router.post("/addNewMachine", controller.addNewMachine);
router.post("/saveComponentMachineInfo", controller.saveComponentMachineInfo);

module.exports = router;
