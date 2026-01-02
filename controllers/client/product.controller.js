const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const getDescendantsHelper = require("../../helpers/getDescendants.helper"); // Gọi helper cũ
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
    try {
        const slug = req.params.slugCategory;
        const category = await ProductCategory.findOne({ slug: slug, deleted: false, status: "active" })
        if (!category) {
            return res.redirect("/404"); // Nếu user gõ bậy bạ
        }
        const listSubCategory = await getDescendantsHelper(category.id);
        const listSubCategoryId = listSubCategory.map(item => item.id);
        listSubCategoryId.push(category.id);
        const records = await Product.find({
            product_category_id: { $in: listSubCategoryId },
            deleted: false,
            status: "active"
        }).sort({ position: "desc" })
        const newRecords = records.map(item => {
            item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
            return item;
        });
        res.render("client/pages/products/index", { title: category.title, records: newRecords })
    } catch (error) {
        const backURL = req.get("Referer");
        res.redirect(backURL);
    }


}