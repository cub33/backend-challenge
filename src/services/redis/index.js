import Redis from 'redis'
import { redis } from '../../config'

const instance = {
  createConnection() {
    const connection = Redis.createClient({ host: redis.url })
    connection.on('error', error => {
      connection.quit()
      console.log('Redis connection error: ' + error)
    })
    return connection
  }
}

export default instance
