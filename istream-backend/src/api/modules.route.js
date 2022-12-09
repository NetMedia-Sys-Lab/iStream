const router = require("express").Router();
const controller = require("../controllers/modules.controller");

router.get("/getModuleConfigsAndParameters", controller.getModuleConfigsAndParameters);
router.get("/getConfigFileData", controller.getConfigFileData);

router.post("/updateConfigFileData", controller.updateConfigFileData);
router.post("/addNewConfigFile", controller.addNewConfigFile);

module.exports = router;
