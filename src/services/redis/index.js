import Redis from 'redis'
import { redis } from '../../config'
import { createLogger } from '../../utils/logger'
const logger = createLogger({ ctx: 'redis' })

const instance = {
  createClient() {
    return Redis.createClient({ host: redis.url })
  },
  createConnection() {
    return new Promise((resolve, reject) => {
      const connection = Redis.createClient({ host: redis.url })
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
