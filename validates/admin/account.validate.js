module.exports.createAccount = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tên tài khoản");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}
module.exports.editAccount = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tên tài khoản");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }

    next()
}