const express = require("express")
const router = express.Router()
const controller = require("../../controllers/client/checkout.controller")
router.get('/', controller.index)
router.post('/order', controller.order)
router.get("/success/:idOrder", controller.success);// Route nhận kết quả từ VNPAY (Thêm mới)

module.exports = router;