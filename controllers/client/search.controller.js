const Product = require("../../models/product.model")

module.exports.search = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    }
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(req.query.keyword, "i")
        find.title = regex;
    }
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
    const records = await Product.find(find).limit(objPagination.limitItem).skip(objPagination.skip)
    res.render("client/pages/search/index", { title: "Trang tìm kiếm", records: records, keyword: keyword, objPagination: objPagination })
}