module.exports.cart = (req, res, next) => {
    if (!req.body.color) {
        req.flash("error", "Bạn chưa chọn màu !");
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    if (!req.body.size) {
        req.flash("error", "Bạn chưa chọn size !");
        const backURL = req.get("Referer")
        res.redirect(backURL)
        return;
    }
    next()
}