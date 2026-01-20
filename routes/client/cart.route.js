const express = require("express")
const router = express.Router()
const controller = require("../../controllers/client/cart.controller")
const cartValidate = require("../../validates/client/cart.validate")

router.post('/add/:id', cartValidate.cart, controller.addPost)
router.get('/', controller.index)
router.get('/update/:productId/:quantity/:size/:color', controller.updateQuantity)
router.get('/delete/:productId/:size/:color', controller.delete)
module.exports = router;