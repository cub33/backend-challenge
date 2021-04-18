import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import redis from './services/redis'
import express from './services/express'
import api from './api'
import { createLogger } from './utils/logger'
const logger = createLogger({ ctx: 'init' })

const server = {
  async init() {
    logger.info('Initializing API server')
    const options = {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 3000
    }
    try {
      await redis.createConnection()
      await mongoose.connect(mongo.uri, options)
    } catch (error) {
      logger.error(error)
      logger.info('init failed, exiting')
      return process.exit(1)
    }

    const app = express(apiRoot, api)
    const server = http.createServer(app)
    server.listen(port, ip, () => {
      logger.info('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  }
}

module.exports = server