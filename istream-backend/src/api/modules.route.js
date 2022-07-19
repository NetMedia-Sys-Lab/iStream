const router = require("express").Router();
const controller = require("../controllers/modules/modules.controller");

router.get("/getDefaultModules", controller.getDefaultModules);
router.get("/getUserModules", controller.getUserModules);
router.get("/getConfigFiles", controller.getConfigFiles);
router.get("/getVideosList", controller.getVideosList);
router.get("/getModuleData", controller.getModuleData);
router.get("/getNetworkConfiguration", controller.getNetworkConfiguration);
router.get("/getServerConfiguration", controller.getServerConfiguration);
router.get("/getHeadlessPlayerConfiguration", controller.getHeadlessPlayerConfiguration);
router.get("/getVideoModuleData", controller.getVideoModuleData);
router.get("/getConfigFileData", controller.getConfigFileData);

router.post("/create", controller.create);
router.post("/addNewConfig", controller.addNewConfig);
router.post("/addNewVideo", controller.addNewVideo);
router.post("/addNewVideoDataset", controller.addNewVideoDataset);
router.post("/saveModuleData", controller.saveModuleData);
router.post("/setNetworkConfiguration", controller.setNetworkConfiguration);
router.post("/setServerConfiguration", controller.setServerConfiguration);
router.post("/setHeadlessPlayerConfiguration", controller.setHeadlessPlayerConfiguration);
router.post("/saveVideoModuleData", controller.saveVideoModuleData);
router.post("/updateConfigFileData", controller.updateConfigFileData);

router.delete("/userModule", controller.deleteUserModule);
router.delete("/userVideo", controller.deleteUserVideo);


module.exports = router;
