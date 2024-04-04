const { Router } = require('express')

const { homeRoutes } = require('./home.routes')
const { storageRoutes } = require('./storage.routes')

const router = Router()

router.use('/', homeRoutes)
router.use('/storage', storageRoutes)

module.exports = { router }
