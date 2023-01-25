const router = require("express").Router();
const controller = require("../controllers/components.controller");

router.get("/getModules", controller.getModules);
router.get("/getComponentData", controller.getComponentData);

router.get("/getDockerConfig", controller.getDockerConfig);

router.post("/addNewModule", controller.addNewModule);
router.post("/saveComponentData", controller.saveComponentData);

router.delete("/userModule", controller.deleteUserModule);

module.exports = router;
