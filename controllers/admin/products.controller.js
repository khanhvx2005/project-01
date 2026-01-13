const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const Account = require('../../models/account.model')
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
        limitItems: 6
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
    // logic sắp xếp
    const sort = {
    }
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;

    } else {
        sort.position = 'desc';
    }
    // end logic sắp xếp

    const records = await Product.find(find).limit(objPagination.limitItems).skip(objPagination.skip).sort(sort)
    for (const record of records) {
        const user = await Account.findOne({
            _id: record.createdBy.account_id,
            deleted: false
        })
        if (user) {
            record.accountFullName = user.fullName;

        }
    }
    res.render('admin/pages/products/index', { title: 'Trang quản lý sản phẩm', records: records, filter: filter, keyword: keyword, objPagination: objPagination })
}
//[PATCH] /admin/product/change-status/:status/:id --> Chuyển đổi trạng thái 1 sản phẩm
module.exports.changeStatus = async (req, res) => {
    //Lấy dữ liệu từ params
    const id = req.params.id;
    const status = req.params.status;
    // Cập nhập DB
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })
    // Chuyển hướng trình duyệt
    req.flash("success", "Cập nhập thành công")
    res.redirect("/admin/products")
}
//[PATCH] /admin/product/change-multi--> Chuyển đổi trạng thái nhiều sản phẩm

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":

            await Product.updateMany({ _id: { $in: ids } }, { status: type, $push: { updatedBy: updatedBy } })
            req.flash("success", "Cập nhập thành công")
            res.redirect("/admin/products")

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: type, $push: { updatedBy: updatedBy } })
            req.flash("success", "Cập nhập thành công")
            res.redirect("/admin/products")
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true, deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash("success", "Xóa sản phẩm thành công")
            res.redirect("/admin/products")
            break;
        case "change-position":
            for (const element of ids) {
                let [id, position] = element.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } })

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
        {
            deleted: true, deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    )
    res.redirect(`${prefixAdmin}/products`)
}
//[GET] /admin/product/create-> Giao diện tạo mới sản phẩm
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }
    function createTree(arr, parent_id = "") {
        const tree = [];
        arr.forEach(item => {
            if (item.parent_id === parent_id) {
                const newItem = item;
                const children = createTree(arr, item.id)
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem)
            }
        });
        return tree;
    }
    const records = await ProductCategory.find(find)
    const newRecords = createTree(records)
    res.render("admin/pages/products/create", { title: "Trang thêm mới sản phẩm", records: newRecords })
}
//[POST] /admin/product/createPost-> Tạo mới sản phẩm

module.exports.createPost = async (req, res) => {
    // 1. Chuẩn hóa dữ liệu cơ bản
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    if (req.body.position == '') {
        const count = await Product.countDocuments({
            deleted: false
        })
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position)

    }

    let variants = [];

    // TH1: Người dùng chỉ nhập 1 dòng -> req.body.size là String (VD: "S")
    // TH2: Người dùng nhập nhiều dòng -> req.body.size là Array (VD: ["S" , "M"])
    // => Ta ép tất cả về Array để dễ xử lý
    const sizes = Array.isArray(req.body.size) ? req.body.size : [req.body.size];
    const colors = Array.isArray(req.body.color) ? req.body.color : [req.body.color];
    const stocks = Array.isArray(req.body.stock) ? req.body.stock : [req.body.stock];
    //Array.isArray(): kiểm tra giá trị truyền vào có phải 1 mảng hay không


    let totalStock = 0;

    // // Lặp qua mảng size để ghép dữ liệu
    for (let i = 0; i < sizes.length; i++) {
        const stock = parseInt(stocks[i]);

        variants.push({
            size: sizes[i],
            color: colors[i],
            stock: stock
        });

        totalStock += stock; // Cộng dồn tổng kho
        // }
    }

    req.body.variants = variants;
    req.body.totalStock = totalStock;
    req.body.createdBy = {
        account_id: res.locals.user.id

    }
    req.body.priceNew = (req.body.price * (100 - req.body.discountPercentage) / 100).toFixed(0);
    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Tạo mới sản phẩm thành công");
    res.redirect(`${prefixAdmin}/products`);
}
//[GET] /admin/product/edit

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const record = await Product.findOne({
        _id: id,
        deleted: false
    })
    function createTree(arr, parent_id = "") {
        const tree = [];
        arr.forEach(item => {
            if (item.parent_id === parent_id) {
                const newItem = item;
                const children = createTree(arr, item.id)
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem)
            }
        });
        return tree;
    }
    const records = await ProductCategory.find({
        deleted: false
    })
    const newRecords = createTree(records)
    res.render("admin/pages/products/edit", { title: "Trang chỉnh sửa sản phẩm", record: record, records: newRecords })
}
//[PATCH] /admin/product/editPatch

module.exports.editPatch = async (req, res) => {

    const id = req.params.id;
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)

    // req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    let variants = [];
    const sizes = Array.isArray(req.body.size) ? req.body.size : [req.body.size];
    const colors = Array.isArray(req.body.color) ? req.body.color : [req.body.color];
    const stocks = Array.isArray(req.body.stock) ? req.body.stock : [req.body.stock];
    let totalStock = 0;

    for (let i = 0; i < sizes.length; i++) {
        const stock = parseInt(stocks[i]);

        variants.push({
            size: sizes[i],
            color: colors[i],
            stock: stock
        });

        totalStock += stock; // Cộng dồn tổng kho
        // }
    }
    req.body.variants = variants;
    req.body.totalStock = totalStock;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    req.body.priceNew = (req.body.price * (100 - req.body.discountPercentage) / 100).toFixed(0);

    await Product.updateOne({ _id: id }, {
        ...req.body,
        $push: { updatedBy: updatedBy }
    })
    req.flash("success", "Cập nhập thành công")
    const backURL = req.get("Referer")
    res.redirect(backURL);
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const item = await Product.findOne({ _id: id, deleted: false })
    const productCategoryId = await ProductCategory.findOne({
        _id: item.product_category_id,
        deleted: false
    })
    if (productCategoryId) {
        item.titleProductCategory = productCategoryId.title;

    }
    res.render("admin/pages/products/detail", { title: "Trang chi tiết sản phẩm", item: item })
}
