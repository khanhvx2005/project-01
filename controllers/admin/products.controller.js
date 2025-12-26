const Product = require("../../models/product.model")
const filterHelpers = require("../../helpers/filter.helper")
const prefixAdmin = require("../../configs/configAdmin.config")
//[GET] /admin/product
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
    const sort = {
        position: "desc"
    }
    const records = await Product.find(find).limit(objPagination.limitItems).skip(objPagination.skip).sort(sort)
    res.render('admin/pages/products/index', { title: 'Trang quản lý sản phẩm', records: records, filter: filter, keyword: keyword, objPagination: objPagination })
}
//[PATCH] /admin/product/change-status/:status/:id --> Chuyển đổi trạng thái 1 sản phẩm
module.exports.changeStatus = async (req, res) => {
    //Lấy dữ liệu từ params
    const id = req.params.id;
    const status = req.params.status;
    // Cập nhập DB
    await Product.updateOne({ _id: id }, { status: status })
    // Chuyển hướng trình duyệt
    req.flash("success", "Cập nhập thành công")
    res.redirect("/admin/products")
}
//[PATCH] /admin/product/change-multi--> Chuyển đổi trạng thái nhiều sản phẩm

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: type })
            req.flash("success", "Cập nhập thành công")
            res.redirect("/admin/products")

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: type })
            req.flash("success", "Cập nhập thành công")
            res.redirect("/admin/products")
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() })
            req.flash("success", "Xóa sản phẩm thành công")
            res.redirect("/admin/products")
            break;
        case "change-position":
            for (const element of ids) {
                let [id, position] = element.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position })

            }
            req.flash("success", "Thay đổi vị trí thành công")
            const backURL = req.get("Referer");
            res.redirect(backURL);
            break;
        default:
            break;
    }
    res.redirect(`${prefixAdmin}/products`);

}
//[DELETE] /admin/product/delete/:id--> Xóa một sản phẩm

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        { deleted: true, deletedAt: new Date() }
    )
    res.redirect(`${prefixAdmin}/products`)
}