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
        req.flash("error", "Bạn chưa email !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Bạn chưa mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}
module.exports.login = (req, res, next) => {

    if (!req.body.email) {
        req.flash("error", "Bạn chưa email !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Bạn chưa mật khẩu !");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}