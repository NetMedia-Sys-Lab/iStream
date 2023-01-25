const router = require("express").Router();
const controller = require("../controllers/machines.controller");

router.get("/getUserMachineList", controller.getUserMachineList);
router.get("/getComponentSelectedMachine", controller.getComponentSelectedMachine);

router.post("/addNewMachine", controller.addNewMachine);
router.post("/saveComponentMachineInfo", controller.saveComponentMachineInfo);

router.delete("/userMachine", controller.deleteUserMachine);

module.exports = router;
