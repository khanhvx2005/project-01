const Account = require('../../models/account.model');

module.exports.requireAuth = async (req, res, next) => {
    // 1. Kiểm tra req.cookies có tồn tại không trước
    if (!req.cookies || !req.cookies.token) {
        return res.redirect("/admin/auth/login");
    }

    try {
        const user = await Account.findOne({
            token: req.cookies.token,
            deleted: false
        }).select("-password");
        if (!user) {
            return res.redirect("/admin/auth/login");
        }
        res.locals.user = user;
        next();
    } catch (error) {
        console.log("Lỗi xác thực:", error);
        return res.redirect("/admin/auth/login");
    }
};