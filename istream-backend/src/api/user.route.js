const router = require("express").Router();
const controller = require("../controllers/user/user.controller");

router.post("/register", controller.userRegistration);

router.get("/getAllUsers", controller.getAllUser);

module.exports = router;
