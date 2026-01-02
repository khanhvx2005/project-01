const Role = require("../../models/roles.model")
const prefixAdmin = require("../../configs/configAdmin.config")
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    })
    res.render("admin/pages/roles/index", { title: "Nhóm quyền", records: records })
}
// [GET] /admin/roles/create

module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", { title: "Trang tạo mới nhóm quyền" })
}
// [POST] /admin/roles/create

module.exports.createPost = async (req, res) => {

    try {
        const role = new Role(req.body);
        await role.save()
        req.flash("success", "Tạo mới nhóm quyền thành công")
        res.redirect(`${prefixAdmin}/roles`)
    } catch (error) {
        req.flash("error", "Tạo mới nhóm quyền thất bại")
        res.redirect(`${prefixAdmin}/roles`)
    }
}
// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {

    const id = req.params.id;
    const record = await Role.findOne({
        _id: id
    })



    res.render("admin/pages/roles/edit", { title: "Trang chỉnh sửa nhóm quyền", record: record })
}
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhập thành công")
    res.redirect(`${prefixAdmin}/roles`)
}
// [DELETE] /admin/roles/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, {
        deleted: true

    })
    req.flash('success', 'Xóa nhóm quyền thành công !');
    const backURL = req.get("Referer") || "/admin/products";
    res.redirect(backURL);

}
// [GET] /admin/roles/permissions

module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    })
    res.render("admin/pages/roles/permissions", { title: "Trang phân quyền", records: records })
}
// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        const { id, permissions } = item;
        await Role.updateOne({ _id: id }, { permission: permissions })
    }
    req.flash("success", "Cập nhập thành công")
    const backURL = req.get("Referer")
    res.redirect(backURL);
}
