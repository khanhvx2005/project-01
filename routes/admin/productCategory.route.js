const express = require("express")
const multer = require('multer')
const fileUpload = multer()
const router = express.Router()
const controller = require("../../controllers/admin/productCategory.controller")
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require("../../validates/admin/createPost.validate")
router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create',
    fileUpload.single('thumbnail'),

    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id',
    fileUpload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch)
router.delete('/delete/:id', controller.deleteItem)



module.exports = router;