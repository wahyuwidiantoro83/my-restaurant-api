const router = require("express").Router();
const { userController } = require("../controller");
const { validateToken } = require("../middleware/validation");

router.post("/regis", userController.register);
router.post("/login", userController.login);
router.get("/checklogin", validateToken, userController.keepLogin);

module.exports = router;
