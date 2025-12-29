const ProductCategory = require("../../models/product-category.model")
const prefixAdmin = require("../../configs/configAdmin.config")
const getDescendants = require("../../helpers/getDescendants.helper");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const filter = [
        {
            name: "Tất cả",
            value: "",
            selected: false
        },
        {
            name: "Hoạt động",
            value: "active",
            selected: false
        },
        {
            name: "Dừng hoạt động",
            value: "inactive",
            selected: false
        }
    ]
    if (req.query.status) {
        find.status = req.query.status;
        const index = filter.findIndex((item) => item.value == req.query.status);

        filter[index].selected = true;
    } else {
        const index = filter.findIndex((item) => item.value == "");
        filter[index].selected = true;
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
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const reg = new RegExp(req.query.keyword, "i");
        find.title = reg;
    }
    const records = await ProductCategory.find(find)

    for (const item of records) {
        if (item.parent_id) {
            const parentId = await ProductCategory.findOne({ _id: item.parent_id });
            item.titleParent = parentId.title;
        } else {
            item.titleParent = "Danh mục gốc";

        }

    }


    if (req.query.keyword || req.query.status) {
        res.render("admin/pages/productCategory/index", { title: "Trang quản lý danh mục", records: records, keyword: keyword, filter: filter })

    } else {
        const newRecords = createTree(records)

        res.render("admin/pages/productCategory/index", { title: "Trang quản lý danh mục", records: newRecords, keyword: keyword, filter: filter })

    }
}
// [GET] /admin/products-category/create

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
    res.render("admin/pages/productCategory/create", { title: "Trang tạo mới danh mục", records: newRecords })
}
// [POST] /admin/products-category/createPost

module.exports.createPost = async (req, res) => {

    if (req.body.position == '') {
        const count = await ProductCategory.countDocuments({
            deleted: false
        })
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position)

    }
    const record = new ProductCategory(req.body);
    await record.save();
    req.flash("success", "Tạo mới danh mục thành công");
    res.redirect(`${prefixAdmin}/products-category`)
}
// [PATCH] /admin/products-category/change-status/:status:id

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    // A. Cập nhật chính nó (Cha)
    await ProductCategory.updateOne({ _id: id }, { status: status });

    // B. Nếu hành động là "Dừng hoạt động" -> Tắt sạch con cháu
    if (status == "inactive") {
        // 1. Gọi helper lấy toàn bộ danh sách con cháu
        const listChildren = await getDescendants(id);

        // listChildren trả về mảng object, ta cần lấy ra mảng ID
        // Ví dụ: ["id_con", "id_chau"]
        const listIds = listChildren.map(item => item.id);

        // 2. Update một lần cho tất cả
        if (listIds.length > 0) {
            await ProductCategory.updateMany(
                { _id: { $in: listIds } },
                { status: "inactive" }
            );
        }
    }
    // Chuyển hướng trình duyệt
    req.flash("success", "Cập nhập thành công")
    res.redirect("/admin/products-category")
}
//[GET] /admin/products-category/edit

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const record = await ProductCategory.findOne({
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


    res.render("admin/pages/productCategory/edit", { title: "Trang chỉnh sửa danh mục", record: record, records: newRecords })
}
//[PATCH] /admin/products-category/editPatch

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhập thành công")
    res.redirect(`${prefixAdmin}/products-category`);
}