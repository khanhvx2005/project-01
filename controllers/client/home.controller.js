const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    const records = await Product.find({
        deleted: false
    })
    // console.log(records);
    res.render("client/pages/homes/index", { title: "Trang chủ", records: records })
}