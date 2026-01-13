const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    const records = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" })

    const recordsFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).sort({ position: "desc" })

    res.render("client/pages/homes/index", { title: "Trang chủ", records: records, recordsFeatured: recordsFeatured })
}
