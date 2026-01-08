const Account = require("../../models/account.model")
const md5 = require('md5');

module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login", { title: "Trang đăng nhập" })
}
module.exports.loginPost = async (req, res) => {
    // Kiểm tra email có tồn tại trong DB không ?
    const user = await Account.findOne({
        email: req.body.email,
        deleted: false

    })
    if (!user) {
        req.flash("error", "Email không tồn tại!")
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    // Nếu như email tồn tại , kiểm tra mật khẩu có đúng không
    if (md5(req.body.password) != user.password) {
        req.flash("error", "Mật khẩu không chính xác!")
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    // Nếu như email tồn tại , mật khẩu đúng , kiểm tra tài khoản có bị khóa không
    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!")
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    res.cookie("token", user.token)
    res.redirect("/admin/dashboard")

}
module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect("/admin/auth/login")
}