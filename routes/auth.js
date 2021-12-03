const router = require("express").Router()
const auth = require(".././middleware/authmw");
const authController = require("../controller/auth-controller")
const {body} = require('express-validator');


router.post("/register",
    body('cid').isLength({min: 3, max: 9}),
    body('password').isLength({min: 5, max: 32}),
    body('name').isLength({min: 1}),
    authController.register
);
router.post("/login", authController.login);
router.get("/me",auth,authController.me);

module.exports = router