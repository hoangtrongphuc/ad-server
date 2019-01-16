'use strict'
const express = require('express')
const { createServer } = require('https')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const router = require('./api/api')
const {format, error} = require('./middleware')
let ssl = null
const port = process.env.PORT;
const start = container => {
  return new Promise((resolve, reject) => {
    const app = express()
    app.use(morgan('dev'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride())
    app.use(cors())
    app.use(helmet())
    app.use((req, res, next) => {
      req.container = container.createScope()
      next()
    })
    router(container, app)
    app.use(format)
    app.use(error)
    if (ssl) {
      const server = createServer(ssl, app).listen(port, () => resolve(server))
    } else {
      const server = app.listen(port, () => resolve(server))
    }
  })
}

module.exports = {
  start
}
