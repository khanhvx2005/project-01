const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")

module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    })
    for (const item of cart.products) {
        const productInfo = await Product.findOne({
            _id: item.product_id
        })

        item.productInfo = productInfo;
        item.totalPrice = productInfo.priceNew * item.quantity;
    }
    cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0)
    res.render("client/pages/checkout/index", { title: "Trang thanh toán", cartDetail: cart })
}
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        note: req.body.note
    }
    const cart = await Cart.findOne({
        _id: cartId
    })
    let totalOrderMoney = 0; // 1. Khởi tạo biến tổng tiền đơn hàng
    const products = [];
    if (cart) {
        for (const product of cart.products) {

            const productInfo = await Product.findOne({
                _id: product.product_id
            })
            if (productInfo) {

                const priceNew = parseInt((productInfo.price * (100 - productInfo.discountPercentage) / 100).toFixed(0));
                const lineTotalPrice = priceNew * product.quantity;
                const objProduct = {
                    product_id: product.product_id,
                    title: productInfo.title,
                    thumbnail: productInfo.thumbnail,
                    size: product.size,
                    color: product.color,
                    price: productInfo.price,
                    discountPercentage: productInfo.discountPercentage, // % giảm lúc mua
                    quantity: product.quantity,
                    totalPrice: lineTotalPrice
                }
                products.push(objProduct)

                totalOrderMoney += lineTotalPrice;
                await Product.updateOne(
                    {
                        _id: product.product_id,
                        "variants.size": product.size,
                        "variants.color": product.color
                    },
                    {
                        $inc: {
                            "variants.$.stock": -product.quantity, // Trừ số lượng ở biến thể
                            "totalStock": -product.quantity        // Trừ tổng tồn kho chung
                        }
                    }
                );
            }
        }

    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        totalMoney: totalOrderMoney, // Lưu tổng tiền vào đơn hàng
        // 4. TRẠNG THÁI THANH TOÁN (Phục vụ VNPAY)
        paymentMethod: req.body.paymentMethod


    }
    const order = new Order(orderInfo)
    await order.save();
    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    })

    res.redirect(`/checkout/success/${order.id}`)

}
//     let secureHash = vnp_Params['vnp_SecureHash'];

//     // 1. Xóa 2 tham số SecureHash và SecureHashType để tính toán lại hash
//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     // 2. Sắp xếp lại tham số (giống lúc gửi đi)
//     vnp_Params = sortObject(vnp_Params);

//     // 3. Ký lại dữ liệu nhận được
//     let secretKey = vnpayConfig.vnp_HashSecret;
//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

//     // 4. So sánh Chữ ký (Để đảm bảo dữ liệu không bị hacker sửa đổi)
//     if (secureHash === signed) {
//         // Chữ ký hợp lệ
//         const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
//         const orderId = vnp_Params['vnp_TxnRef'];

//         // Mã '00' là thành công
//         if (vnp_ResponseCode === '00') {
//             // Cập nhật trạng thái đơn hàng trong DB
//             await Order.updateOne(
//                 { _id: orderId },
//                 {
//                     paymentStatus: "paid", // Đã thanh toán
//                     // Lưu lại toàn bộ info VNPAY trả về để sau này đối soát
//                     paymentInfo: vnp_Params
//                 }
//             );

//             // Chuyển hướng về trang Success của bạn
//             res.redirect(`/checkout/success/${orderId}`);
//         } else {
//             // Thanh toán thất bại/Hủy bỏ
//             res.redirect("/checkout/failure"); // Bạn tự làm trang này nhé
//         }
//     } else {
//         // Sai chữ ký (Có dấu hiệu giả mạo)
//         res.send("Có lỗi xảy ra: Sai chữ ký bảo mật!");
//     }
// };

module.exports.success = async (req, res) => {

    const order = await Order.findOne({
        _id: req.params.idOrder
    });
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });


}

