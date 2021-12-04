const router = require("express").Router()
const auth = require(".././middleware/authmw")
const productController = require('../controller/product-controller')
const uploadHandler = require('../middleware/uploadmw');



router.post("/add", auth,uploadHandler.single('pic'), productController.addProduct)
router.get("/", productController.getAllProducts)
router.get("/:name", productController.getOneProduct)
router.put("/edit/:name", auth,uploadHandler.single('pic'), productController.editProduct)
router.delete("/delete/:name", auth, productController.deleteProduct)
module.exports = router