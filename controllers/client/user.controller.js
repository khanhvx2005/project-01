const User = require("../../models/user.model")
const md5 = require("md5")
module.exports.register = (req, res) => {
    res.render("client/pages/users/register", { title: "Trang đăng ký" })
}
module.exports.registerPost = async (req, res) => {
    const email = req.body.email;
    const exitsEmail = await User.findOne({
        email: email,
        deleted: false,
        status: "active"
    })
    if (exitsEmail) {
        req.flash("error", "Email đã tồn tại !");
        const backURL = req.get("Referer");
        res.redirect(backURL);
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body)
    await user.save()
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng ký thành công !");
    res.redirect("/");


}
module.exports.login = (req, res) => {
    res.render("client/pages/users/login", { title: "Trang đăng nhập" })
}
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại !")
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu !")
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa !")
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    res.cookie("tokenUser", user.tokenUser)
    req.flash("success", "Đăng nhập thành công")
    res.redirect("/")
}
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect('/')
}