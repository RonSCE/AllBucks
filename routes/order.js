const router = require("express").Router()
const orderController = require('../controller/order-controller')
const auth = require(".././middleware/authmw")
router.post("/create", orderController.create)
router.get("/active",auth, orderController.getActiveOrders)
router.get("/user/:id",auth, orderController.getUser)
router.get("/:id", orderController.getOrder)
router.patch("/edit-status/:id", orderController.editStatus)
router.patch("/charge-points/:id",auth,orderController.chargePoints)
router.patch("/complete-order/:id",auth,orderController.completeOrder)
router.put("/edit/:id", orderController.edit)


module.exports = router