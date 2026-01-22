const Order = require("../../models/order.model")
module.exports.index = async (req, res) => {
    const records = await Order.find()

    res.render('admin/pages/orders/index.pug', { title: 'Trang Quản lý đơn hàng', records: records })
}