import { redis, env } from '../../config'

import { createLogger } from '../../utils/logger'
const logger = createLogger({ ctx: 'redis' })

const instance = {
  createClient() {
    let Redis = {}
    if (env !== 'test') {
      Redis = require('redis')
      return Redis.createClient({ host: redis.url })
    }
    else {
      Redis = require('redis-mock')
      return Redis.createClient()
    }
  },
  createConnection() {
    return new Promise((resolve, reject) => {
      const connection = this.createClient()
      connection.on('error', error => {
        connection.quit()
        logger.error('Connection error: ' + error)
      })
      connection.on('connect', () => {
        return resolve(connection)
      })
      setTimeout(() => {
        if (!connection.connected) {
          return reject(new Error(`Cannot connect to Redis URL "${redis.url}"`))
        }
      }, 3000);
    })
  }
}

export default instance
