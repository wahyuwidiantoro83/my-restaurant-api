const router = require("express").Router();
const { uploader } = require("../helpers/uploader");
const { productController } = require("../controller");
const { validateToken } = require("../middleware/validation");

router.get("/", productController.getProduct);
router.get("/manage", productController.getProductManage);
router.post(
  "/create",
  uploader("/product").single("productImage"),
  productController.createProduct
);
router.patch(
  "/update/:id",
  uploader("/product").single("productImage"),
  productController.updateProduct
);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
