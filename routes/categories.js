const router = require("express").Router();
const { uploader } = require("../helpers/uploader");
const { categoryController } = require("../controller");
const { validateToken } = require("../middleware/validation");

router.get("/", categoryController.getCategory);
router.post(
  "/create",
  uploader("/category").single("categoryImage"),
  categoryController.createCategory
);
router.patch(
  "/update/:id",
  uploader("/category").single("categoryImage"),
  categoryController.updateCategory
);
router.delete("/delete/:id", categoryController.deleteCategory);
module.exports = router;
