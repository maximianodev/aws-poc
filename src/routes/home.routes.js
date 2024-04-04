const { Router } = require('express')

const { HomeController } = require('../controllers/home.controller')

const homeRoutes = Router()
const homeController = new HomeController()

homeRoutes.get('/', (req, res) => {
  return homeController.render(req, res)
})

module.exports = { homeRoutes }
