module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tên sản phẩm");
        const backURL = req.get("Referer");
        res.redirect(backURL)
        return;
    }
    next()
}