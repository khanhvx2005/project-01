const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    const records = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" })
    records.forEach((record) => {
        record.priceNew = parseInt((record.price * ((100 - record.discountPercentage) / 100)).toFixed(0));
    })
    res.render("client/pages/homes/index", { title: "Trang chủ", records: records })
}
