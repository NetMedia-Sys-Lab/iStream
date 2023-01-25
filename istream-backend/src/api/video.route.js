const router = require("express").Router();
const controller = require("../controllers/video.controller");

router.get("/getUserVideosList", controller.getUserVideosList);
router.get("/getDefaultVideosList", controller.getDefaultVideosList);
router.get("/getVideoModuleData", controller.getVideoModuleData);

router.post("/addNewVideo", controller.addNewVideo);
router.post("/addNewVideoDataset", controller.addNewVideoDataset);
router.post("/saveVideoModuleData", controller.saveVideoModuleData);

router.delete("/userVideo", controller.deleteUserVideo);

module.exports = router;