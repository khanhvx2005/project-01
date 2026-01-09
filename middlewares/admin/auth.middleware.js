const Account = require('../../models/account.model');
const Role = require('../../models/roles.model')
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
        const role = await Role.findOne({
            _id: user.role_id,
            deleted: false
        }).select('title permission')
        res.locals.user = user;
        res.locals.role = role;
        next();
    } catch (error) {
        console.log("Lỗi xác thực:", error);
        return res.redirect("/admin/auth/login");
    }
};