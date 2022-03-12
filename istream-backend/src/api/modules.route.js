const router = require("express").Router();
const controller = require("../controllers/modules/modules.controller");

router.get("/getDefaultModules", controller.getDefaultModules);
router.get("/getUserModules", controller.getUserModules);
router.post("/create", controller.create);
router.post("/addNewConfig", controller.addNewConfig);
router.get("/getConfigFiles", controller.getConfigFiles);

module.exports = router;
