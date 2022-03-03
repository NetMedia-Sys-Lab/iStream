const router = require("express").Router();
const controller = require("../controllers/modules/modules.controller");

router.get("/getDefaultModules", controller.getDefaultModules);
router.get("/getUserModules", controller.getUserModules);

module.exports = router;
