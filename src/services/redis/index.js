import Redis from 'ioredis'
import { redis } from '../../config'

const instance = {
  connect() {
    const connection = new Redis(redis.url)
    connection.on('error', error => {
      connection.quit()
      console.log('Redis connection error: ' + error)
    })
  }
}

export default instance
