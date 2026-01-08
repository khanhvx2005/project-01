const express = require("express")
const multer = require('multer')
const fileUpload = multer()
const router = express.Router()
const controller = require("../../controllers/admin/account.controller")
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require("../../validates/admin/account.validate")
router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create',
    fileUpload.single('avatar'),

    uploadCloud.upload,
    validate.createAccount,
    controller.createPost)
router.get('/edit/:id', controller.edit)

router.patch('/edit/:id',
    fileUpload.single('avatar'),

    uploadCloud.upload,
    validate.editAccount,
    controller.editPatch)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.delete('/delete/:id', controller.deleteItem)

module.exports = router;