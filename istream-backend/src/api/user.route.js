const router = require("express").Router();
const controller = require("../controllers/user/user.controller");

router.get("/getAllUsers", controller.getAllUser);

router.post("/register", controller.userRegistration);

module.exports = router;
