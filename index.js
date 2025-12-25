const express = require('express')
// Cấu hình file .env
require('dotenv').config()
const app = express()
const port = process.env.PORT

// Cấu hình pug
app.set('views', './views')
app.set('view engine', 'pug')
// End Cấu hình pug
// Gọi route admin và client
const routeAdmin = require("./routes/admin/index.route")

const routeClient = require("./routes/client/index.route")
routeAdmin(app);
routeClient(app);
//Cấu hình file tĩnh
app.use(express.static('public'))
app.locals.prefixAdmin = '/admin';

// Kết nối dự án vs mongoDB
const database = require("./configs/database.config")
database.connect()



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
