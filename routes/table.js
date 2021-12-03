const router = require("express").Router()
const auth = require(".././middleware/authmw")
const tableController = require('../controller/table-controller')




router.post("/add", auth, tableController.add)
router.get("/", tableController.getAll)
router.get("/:tableNum", tableController.getOne)
router.put("/edit/:tableNum", auth, tableController.edit)
router.delete("/delete/:tableNum", auth, tableController.delete)
module.exports = router