const { transactionController } = require("../controller");
const router = require("express").Router();

router.post("/create", transactionController.createTransaction);

module.exports = router;
