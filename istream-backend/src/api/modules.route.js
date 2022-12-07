const router = require("express").Router();
const controller = require("../controllers/modules.controller");

router.get("/getDefaultModules", controller.getDefaultModules);
router.get("/getUserModules", controller.getUserModules);
router.get("/getModuleConfigsAndParameters", controller.getModuleConfigsAndParameters);
router.get("/getConfigFileData", controller.getConfigFileData);
router.get("/getVideosList", controller.getVideosList);
router.get("/getDefaultVideosList", controller.getDefaultVideosList);
router.get("/getModuleData", controller.getModuleData);
router.get("/getModuleDockerConfig", controller.getModuleDockerConfig);

router.post("/create", controller.create);
router.post("/updateConfigFileData", controller.updateConfigFileData);
router.post("/addNewConfigFile", controller.addNewConfigFile);
router.post("/addNewVideo", controller.addNewVideo);
router.post("/addNewVideoDataset", controller.addNewVideoDataset);
router.post("/saveModuleData", controller.saveModuleData);

module.exports = router;
