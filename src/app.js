import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'


const server = {
  async init() {
    console.log('Initializing API server')
    const options = {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 3000
    }
    await mongoose.connect(mongo.uri, options)
  
    const app = express(apiRoot, api)
    const server = http.createServer(app)
  
    server.listen(port, ip, () => {
      console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  }
}

module.exports = server