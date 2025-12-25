const mongoose = require('mongoose');
module.exports.connect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONG_URL);
        console.log("Connect thành công")

    } catch (error) {
        console.log("Connect thất bại")

    }
}