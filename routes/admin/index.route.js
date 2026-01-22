const productsRoute = require("./products.route")
const dashboardRoute = require("./dashboard.route")
const productCategoryRoute = require("./productCategory.route")
const rolesRoute = require("./roles.route")
const accountRoute = require("./account.route")
const authRoute = require("./auth.route")
const userRoute = require("./user.route")
const authMiddleware = require("../../middlewares/admin/auth.middleware")
const orderRoute = require("./order.route")
module.exports = (app) => {
    app.use(`/admin/dashboard`, authMiddleware.requireAuth, dashboardRoute)

    app.use(`/admin/products`, authMiddleware.requireAuth, productsRoute)
    app.use(`/admin/products-category`, authMiddleware.requireAuth, productCategoryRoute)
    app.use(`/admin/roles`, authMiddleware.requireAuth, rolesRoute)
    app.use(`/admin/accounts`, authMiddleware.requireAuth, accountRoute)
    app.use(`/admin/auth`, authRoute)
    app.use(`/admin/users`, authMiddleware.requireAuth, userRoute)
    app.use(`/admin/orders`, authMiddleware.requireAuth, orderRoute)





}
