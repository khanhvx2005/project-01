const flash = require('express-flash')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

// Cấu hình file .env
require('dotenv').config()
// Cấu hình thư viện method-override
const methodOverride = require('method-override')
// Cấu hình thư viện body-parser

const bodyParser = require('body-parser')
const moment = require('moment')
const app = express()
const port = process.env.PORT

// Cấu hình pug
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
// End Cấu hình pug
// Cấu hình thư viện method-override
app.use(methodOverride('_method'))
// Cấu hình thư viện body-parser
app.use(bodyParser.urlencoded())
// Cấu hình express-flash
app.use(cookieParser('ABCDFGH'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// Gọi route admin và client
const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")
routeAdmin(app);
routeClient(app);
//Cấu hình file tĩnh
app.use(express.static(`${__dirname}/public`))
app.locals.prefixAdmin = '/admin';
app.locals.moment = moment;
// Kết nối dự án vs mongoDB
const database = require("./configs/database.config")
database.connect()



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
