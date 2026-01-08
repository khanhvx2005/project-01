const Role = require("../../models/roles.model")
const Account = require('../../models/account.model')
const md5 = require('md5');
const prefixAdmin = require("../../configs/configAdmin.config")

module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
    }).select("-password -token")
    for (const item of records) {
        const role = await Role.findOne({
            _id: item.role_id,
            deleted: false
        })
        if (role) {
            item.role = role;
        }

    }
    res.render('admin/pages/account/index.pug', { title: 'Trang tài khoản', records: records })
}
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render('admin/pages/account/create.pug', { title: "Trang tạo tài khoản", roles: roles })
}
module.exports.createPost = async (req, res) => {
    const exitsEmail = await Account.findOne({
        email: req.body.email,
        status: "active",
        deleted: false
    })
    if (exitsEmail) {
        req.flash("error", "Email đã tồn tại!");
        const backURL = req.get("Referer")
        res.redirect(backURL)

    } else {
        req.body.password = md5(req.body.password)

        const account = new Account(req.body)
        await account.save()
        req.flash("success", "Tạo tài khoản thành công");
        const backURL = req.get("Referer")
        res.redirect(backURL)
    }
}
module.exports.edit = async (req, res) => {
    try {
        const data = await Account.findOne({
            _id: req.params.id,
            deleted: false
        })
        const roles = await Role.find({
            deleted: false
        })
        res.render("admin/pages/account/edit", { title: "Trang chỉnh sửa tài khoản", data: data, roles: roles })

    } catch (error) {
        req.flash("error", "Lỗi")
        const backURL = req.get("Referer")
        res.redirect(backURL)
    }

}
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;


    const emailExis = await Account.findOne({
        _id: { $ne: id },
        deleted: false,
        email: req.body.email
    })

    if (emailExis) {
        req.flash("error", "Email này đã tồn tại !");
        const backURL = req.get("Referer")
        res.redirect(backURL);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        } else {
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhập tài khoản thành công!");
        const backURL = req.get("Referer")
        res.redirect(backURL);

    }
}
module.exports.changeStatus = async (req, res) => {
    //Lấy dữ liệu từ params
    const id = req.params.id;
    const status = req.params.status;
    // Cập nhập DB
    await Account.updateOne({ _id: id }, { status: status })
    // Chuyển hướng trình duyệt
    req.flash("success", "Cập nhập thành công")
    res.redirect("/admin/accounts")
}
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Account.updateOne(
        { _id: id },
        { deleted: true, deletedAt: new Date() }
    )
    res.redirect(`${prefixAdmin}/accounts`)
}