const router = require("express").Router()
const auth = require(".././middleware/authmw")
const productController = require('../controller/product-controller')




router.post("/add", auth, productController.addProduct)
router.get("/", productController.getAllProducts)
router.get("/:name", productController.getOneProduct)
router.put("/edit/:name", auth, productController.editProduct)
router.delete("/delete/:name", auth, productController.deleteProduct)
module.exports = router