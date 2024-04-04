const { Router } = require('express')
const multer = require('multer')

const { StorageController } = require('../controllers/storage.controller')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const storageRoutes = Router()
const storageController = new StorageController()

storageRoutes.post(
  '/upload',
  upload.single('file'),
  storageController.uploadFile
)

module.exports = { storageRoutes }
