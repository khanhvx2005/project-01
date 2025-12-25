const Product = require("../../models/product.model")
const filterHelpers = require("../../helpers/filter.helper")
module.exports.index = async (req, res) => {


    const find = {
        deleted: false
    }
    // Logic lọc trạng thái
    const filter = filterHelpers(req.query)
    if (req.query.status) {
        find.status = req.query.status;
    }
    //End Logic lọc trạng thái
    // Logic tìm kiếm

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const reg = new RegExp(req.query.keyword, "i");
        find.title = reg;
    }
    //End Logic tìm kiếm
    // Logic phân trang
    let objPagination = {
        currentPage: 1,
        limitItems: 4
    }
    if (req.query.page) {
        objPagination.currentPage = parseInt(req.query.page);
    }
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItems;
    const countDocument = await Product.countDocuments(find);
    const totalPage = Math.ceil(countDocument / objPagination.limitItems);
    objPagination.totalPage = totalPage;
    objPagination.countDocument = countDocument;
    objPagination.start = objPagination.skip + 1;
    objPagination.end = Math.min(objPagination.skip + objPagination.limitItems, objPagination.countDocument)
    // Xử lý trường hợp đặc biệt: Nếu không tìm thấy sản phẩm nào (count = 0)
    if (countDocument === 0) {
        objPagination.start = 0;
        objPagination.end = 0;
    }

    // end logic phân trang
    const records = await Product.find(find).limit(objPagination.limitItems).skip(objPagination.skip)
    res.render('admin/pages/products/index', { title: 'Trang quản lý sản phẩm', records: records, filter: filter, keyword: keyword, objPagination: objPagination })
}