const crypto = require('node:crypto')
const { Upload } = require('@aws-sdk/lib-storage')
const { S3Client } = require('@aws-sdk/client-s3')
const { fromIni } = require('@aws-sdk/credential-provider-ini')

class S3Service {
  constructor() {
    this.S3_REGION = process.env.S3_REGION
    this.S3_CREDENTIAL_PROFILE = process.env.S3_CREDENTIAL_PROFILE
    this.S3_BUCKET = process.env.S3_BUCKET
  }

  async upload({ file }) {
    const hash = crypto.randomBytes(32).toString('hex')
    const fileName = `${hash}-${file.originalname}`

    try {
      const parallelUploads3 = new Upload({
        client: new S3Client({
          region: this.S3_REGION,
          credentials: fromIni({
            profile: this.S3_CREDENTIAL_PROFILE,
          }),
        }),
        tags: [],
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
        leavePartsOnError: false,
        params: {
          Bucket: this.S3_BUCKET,
          Key: fileName,
          Body: file.buffer,
        },
      })

      await parallelUploads3.done()
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = { S3Service }
