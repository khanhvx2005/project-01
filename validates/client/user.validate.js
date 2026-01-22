module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Bạn chưa nhập tên !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.phone) {
        req.flash("error", "Bạn chưa nhập sd điện thoại!");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Bạn chưa nhập email !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Bạn chưa nhập mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}
module.exports.login = (req, res, next) => {

    if (!req.body.email) {
        req.flash("error", "Bạn chưa nhập email !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Bạn chưa nhập mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}
module.exports.forgotPassword = (req, res, next) => {

    if (!req.body.email) {
        req.flash("error", "Bạn chưa nhập email !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }

    next()
}
module.exports.otp = (req, res, next) => {

    if (!req.body.otp) {
        req.flash("error", "Bạn chưa nhập mã otp !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }

    next()
}
module.exports.reset = (req, res, next) => {

    if (!req.body.password) {
        req.flash("error", "Bạn chưa nhập mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Bạn chưa xác nhận mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Mật khẩu xác thực không khớp !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }

    next()
}