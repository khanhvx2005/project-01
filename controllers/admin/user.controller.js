const User = require("../../models/user.model")
module.exports.index = async (req, res) => {
    const records = await User.find()
    res.render("admin/pages/users/index", { title: "Trang quản lý người dùng", records: records })
}