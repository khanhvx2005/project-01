const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const getDescendantsHelper = require("../../helpers/getDescendants.helper"); // Gọi helper cũ
const paginationHelper = require("../../helpers/pagination.helper")
const sortHelper = require("../../helpers/sort.helper")
const priceRangeHelper = require("../../helpers/priceRange.helper")
// [GET] /products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    }

    // logic sắp xếp
    // Sắp xếp theo giá 
    const sort = sortHelper(req.query);
    // end logic sắp xếp theo giá

    // Lọc sản phẩm theo giá
    const priceRange = priceRangeHelper(req.query, find);
    // hết lọc sản phẩm theo giá

    // Lấy ra sản phẩm nổi bật
    if (req.query.featured) {
        find.featured = req.query.featured;
    }
    // Hết lấy ra sản phẩm nổi bật

    // Phân trang
    const countDocument = await Product.countDocuments(find)
    const objPagination = paginationHelper(req.query, countDocument)
    // Hết phân trang

    const records = await Product.find(find).limit(objPagination.limitItem).skip(objPagination.skip).sort(sort)
    res.render("client/pages/products/index", { title: "Trang sản phẩm", records: records, objPagination: objPagination, priceRange: priceRange, priceRange: priceRange })
}
// [GET] /products//detail/:id

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug, deleted: false })
    res.render('client/pages/products/detail', { title: req.params.slug, product: product })
}
// [GET] /products/:slugCategory
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
        const find = {
            deleted: false,
            status: "active"
        }

        // Lấy ra sản phẩm nổi bật
        if (req.query.featured) {
            find.featured = req.query.featured;
        }
        // Hết lấy ra sản phẩm nổi bật
        // Sắp xếp theo giá 
        const sort = sortHelper(req.query);
        // end logic sắp xếp theo giá

        // Lọc sản phẩm theo giá
        const priceRange = priceRangeHelper(req.query, find);
        // hết lọc sản phẩm theo giá

        // Phân trang
        const countDocument = await Product.countDocuments(find)
        const objPagination = paginationHelper(req.query, countDocument)
        // Hết phân trang
        const records = await Product.find({
            product_category_id: { $in: listSubCategoryId },
            deleted: false,
            status: "active"
        }).limit(objPagination.limitItem).skip(objPagination.skip).sort(sort)


        res.render("client/pages/products/index", { title: category.title, records: records, objPagination: objPagination, priceRange: priceRange })
    } catch (error) {
        const backURL = req.get("Referer");
        res.redirect(backURL);
    }
}