const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
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
module.exports.category = async (req, res) => {
    const slug = req.params.slugCategory;
    const category = await ProductCategory.findOne({ slug: slug, deleted: false })
    const records = await Product.find({
        product_category_id: category.id,
        deleted: false,
        status: "active"
    }).sort({ position: "desc" })
    res.render("client/pages/products/index", { title: category.title, records: records })

}