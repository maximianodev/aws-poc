const path = require('path')

class HomeController {
  render(_req, res) {
    const dirname = path.resolve()

    res.sendFile(`${dirname}/public/index.html`)
  }
}

module.exports = { HomeController }
