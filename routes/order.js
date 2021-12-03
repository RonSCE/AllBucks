const router = require("express").Router()
const orderController = require('../controller/order-controller')

// router.get("/", auth, orderController.getMyOrders) // -> TODO:?
router.post("/create", orderController.create)
router.get("/order/:id", orderController.getOrder)
router.patch("/edit-order/:id", orderController.editOrder)
router.delete("/cancel-order/:id",orderController.cancelOrder)
router.post("/add-product/:orderId", orderController.addProduct)
router.delete("/delete-product/:orderId&:productName", orderController.deleteProduct)


module.exports = router