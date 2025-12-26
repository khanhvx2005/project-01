const express = require("express")
const multer = require('multer')
const fileUpload = multer()
const router = express.Router()
const controller = require("../../controllers/admin/products.controller")
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require("../../validates/admin/createPost.validate")
router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem)
router.get('/create', controller.create)
router.post('/create',
    fileUpload.single('thumbnail'),

    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', fileUpload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.editPatch)
router.get('/detail/:id', controller.detail)
module.exports = router;