import 'dotenv/config'
import path from 'path'
import { Transform } from 'stream'

import express from 'express'
import formidable from 'formidable'

import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-provider-ini'

const app = express()
app.use(express.json())

const dirname = path.resolve()

const port = process.env.PORT
const region = process.env.S3_REGION
const credential_profile = process.env.S3_CREDENTIAL_PROFILE
const Bucket = process.env.S3_BUCKET

app.get('/', (req, res) => {
  res.sendFile(`${dirname}/front/index.html`)
})

app.post('/upload', async (req, res) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024,
      allowEmptyFiles: false,
    })

    form.parse(req, (err, fields, files) => {})

    form.on('error', (error) => {
      reject(error.message)
    })

    form.on('data', (data) => {
      if (data.name === 'successUpload') {
        resolve(data.value)
        res.status(201)
        res.send('File uploaded successfully')
      }
    })

    form.on('fileBegin', (name, file) => {
      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk)
          },
        })

        this._writeStream.on('error', (error) => form.emit('error', error))

        new Upload({
          client: new S3Client({
            region,
            credentials: fromIni({
              profile: credential_profile
            }),
          }),
          tags: [],
          queueSize: 4,
          partSize: 5 * 1024 * 1024,
          leavePartsOnError: false,
          params: {
            // ACL: 'public-read',
            Bucket,
            Key: `${Date.now().toString()}-${this.originalFilename}`,
            Body: this._writeStream,
          },
        })
          .done()
          .then((data) => {
            form.emit('data', { name: 'successUpload', value: data })
          })
          .catch((err) => {
            form.emit('error', err)
          })
      }
    })
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
