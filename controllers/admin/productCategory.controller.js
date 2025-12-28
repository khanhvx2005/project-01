const ProductCategory = require("../../models/product-category.model")
const prefixAdmin = require("../../configs/configAdmin.config")
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

    const newRecords = createTree(records)
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