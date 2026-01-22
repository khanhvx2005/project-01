const User = require("../../models/user.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate.helper")
const ForgotPassword = require("../../models/forgot-password.model")
const sendMailHelper = require('../../helpers/sendMail.helper')

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
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/users/forgot-password", { title: "Trang lấy lại mật khẩu" })
}
module.exports.forgotPasswordPost = async (req, res) => {

    const email = req.body.email;
    // check email người dùng muốn láy có trong DB không
    const exitsEmail = await User.findOne({
        email: email,
        deleted: false,
        status: "active"
    })
    if (!exitsEmail) {
        req.flash("error", "Email không tồn tại")
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    // Lưu thông tin email và mã otp vào trong DB

    const otp = generateHelper.generateRandomNumber(6)
    const objForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()

    }
    const forgotPassword = new ForgotPassword(objForgotPassword);
    await forgotPassword.save()
    // Trả mã otp về email (làm sau)
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b> . Thời hạn sử dụng 3 phút`;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp/?email=${email}`)

}
module.exports.otp = (req, res) => {
    const email = req.query.email;
    res.render("client/pages/users/otp", { title: "Trang xác nhận mã otp", email: email })
}
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const exitOtp = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!exitOtp) {
        req.flash("error", "Mã otp không tồn tại")
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")
}
module.exports.reset = (req, res) => {
    res.render("client/pages/users/reset", { title: "Trang xác nhận mật khẩu mới" })
}
module.exports.resetPost = async (req, res) => {
    const password = md5(req.body.password);
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, { password: password })
    req.flash("success", "Đổi mật khẩu thành công !")
    res.redirect("/")
}