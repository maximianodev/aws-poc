require('dotenv/config')
const express = require('express')

const { router } = require('./routes/index')

const app = express()

app.use(express.json())
app.use(router)

app.listen(process.env.PORT, () => console.log(`Server is running`))
