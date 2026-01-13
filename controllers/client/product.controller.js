const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const getDescendantsHelper = require("../../helpers/getDescendants.helper"); // Gọi helper cũ
// [GET] products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    }
    // phân trang
    const objPagination = {
        limitItem: 12,
        currentPage: 1
    }
    if (req.query.page) {
        objPagination.currentPage = parseInt(req.query.page)
    }
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItem;
    const countDocument = await Product.countDocuments(find)
    const totalPage = Math.ceil(countDocument / objPagination.limitItem);
    objPagination.totalPage = totalPage;
    objPagination.start = objPagination.skip + 1;
    objPagination.end = Math.min(objPagination.skip + objPagination.limitItem, countDocument)
    objPagination.countDocument = countDocument;
    // hết phân trang
    // logic sắp xếp
    const sort = {
    }
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;

    } else {
        sort.position = 'desc';
    }
    // end logic sắp xếp
    // 2. LOGIC LỌC THEO GIÁ
    const priceRange = req.query.priceRange;

    if (priceRange) {
        // Tách chuỗi "100000-300000" thành mảng [100000, 300000]
        const [min, max] = priceRange.split('-');

        // Khởi tạo object truy vấn cho priceNew
        find.priceNew = {};

        // Nếu có min (Lớn hơn hoặc bằng)
        if (min) {
            find.priceNew.$gte = parseInt(min);
        }

        // Nếu có max (Nhỏ hơn hoặc bằng)
        if (max) {
            find.priceNew.$lte = parseInt(max);
        }
    }
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
        // phân trang
        const objPagination = {
            limitItem: 12,
            currentPage: 1
        }
        if (req.query.page) {
            objPagination.currentPage = parseInt(req.query.page)
        }
        objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItem;
        const countDocument = await Product.countDocuments(find)
        const totalPage = Math.ceil(countDocument / objPagination.limitItem);
        objPagination.totalPage = totalPage;
        objPagination.start = objPagination.skip + 1;
        objPagination.end = Math.min(objPagination.skip + objPagination.limitItem, countDocument)
        objPagination.countDocument = countDocument;
        // hết phân trang
        // logic sắp xếp
        const sort = {
        }
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;

        } else {
            sort.position = 'desc';
        }
        // end logic sắp xếp
        const records = await Product.find({
            product_category_id: { $in: listSubCategoryId },
            deleted: false,
            status: "active"
        }).limit(objPagination.limitItem).skip(objPagination.skip).sort(sort)


        res.render("client/pages/products/index", { title: category.title, records: records, objPagination: objPagination })
    } catch (error) {
        const backURL = req.get("Referer");
        res.redirect(backURL);
    }
}