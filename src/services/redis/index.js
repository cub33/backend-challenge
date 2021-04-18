import Redis from 'redis'
import { redis } from '../../config'

const instance = {
  connect() {
    const connection = Redis.createClient({ host: redis.url })
    connection.on('error', error => {
      connection.quit()
      console.log('Redis connection error: ' + error)
    })
  }
}

export default instance
