const Product = require("../../models/product.model")
const filterHelpers = require("../../helpers/filter.helper")
module.exports.index = async (req, res) => {


    const find = {
        deleted: false
    }
    // Logic lọc trạng thái
    const filter = filterHelpers(req.query)
    //End Logic lọc trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const reg = new RegExp(req.query.keyword, "i");
        find.title = reg;
    }
    const records = await Product.find(find)
    res.render('admin/pages/products/index', { title: 'Trang quản lý sản phẩm', records: records, filter: filter, keyword: keyword })
}