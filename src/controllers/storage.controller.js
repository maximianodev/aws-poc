const { S3Service } = require('../services/s3')

class StorageController {
  async uploadFile(req, res) {
    if (!req.is('multipart/form-data')) {
      res.status(400)
      res.send({ message: 'invalid request' })

      return
    }

    const s3Service = new S3Service()
    
    try {
      await s3Service.upload({ file: req.file })

      res.status(200)
      res.send({ message: 'success' })
    } catch (err) {
      res.status(500)
      res.send({ message: 'internal server error' })

      return
    }
  }
}

module.exports = { StorageController }
