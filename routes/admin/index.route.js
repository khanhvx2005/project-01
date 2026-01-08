const productsRoute = require("./products.route")
const dashboardRoute = require("./dashboard.route")
const productCategoryRoute = require("./productCategory.route")
const rolesRoute = require("./roles.route")
const accountRoute = require("./account.route")
const authRoute = require("./auth.route")

const prefixAdmin = require("../../configs/configAdmin.config")
module.exports = (app) => {
    app.use(`${prefixAdmin}`, dashboardRoute)

    app.use(`${prefixAdmin}/products`, productsRoute)
    app.use(`${prefixAdmin}/products-category`, productCategoryRoute)
    app.use(`${prefixAdmin}/roles`, rolesRoute)
    app.use(`${prefixAdmin}/accounts`, accountRoute)
    app.use(`${prefixAdmin}/auth`, authRoute)



}
