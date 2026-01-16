const Cart = require("../../models/cart.model")
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);
    const size = req.body.size;
    const color = req.body.color;
    let cart = await Cart.findOne({
        _id: cartId
    })
    // Kiểm tra giỏ hàng có trong DB chưa , nếu chưa có tức là lần đầu tiến bấm thêm giỏ hàng thì lúc này mới tạo giỏ hàng trong DB
    if (!cart) {
        cart = new Cart({
            _id: cartId,
            products: []
        });
        await cart.save()
    }
    const existProduct = cart.products.find((item) => item.product_id === productId && item.size === size && item.color === color)
    if (existProduct) {
        const quantityNew = quantity + existProduct.quantity;
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        })
        const backURL = req.get("Referer");
        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
        res.redirect(backURL)
    } else {
        const objProducts = {

            product_id: productId,
            quantity: quantity,
            size: size,
            color: color
        };
        await Cart.updateOne({
            _id: cartId
        }, {
            $push: { products: objProducts }
        })
        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
        const backURL = req.get("Referer");
        res.redirect(backURL)
    }
    // Logic thêm sản phẩm vào giỏ hàng



}