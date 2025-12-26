const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
    const records = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" })
    res.render("client/pages/products/index", { title: "Trang sản phẩm", records: records })
}
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug, deleted: false })
    res.render('client/pages/products/detail', { title: req.params.slug, product: product })
}