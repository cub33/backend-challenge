import redis from '../redis'
import { createLogger } from '../../utils/logger'
const logger = createLogger({ ctx: 'session_manager' })

const redisClient = redis.createClient()

const PLAY_SESSIONS_LIMIT = 3
const MAX_LIMIT_ERR_MSG = 'MAX_LIMIT_REACHED'

const addPlayContentSession = userId => new Promise((resolve, reject) => {
  redisClient.incr(userId, (err, playSessionNumber) => {
    if (err) return reject(err)

    if (playSessionNumber <= PLAY_SESSIONS_LIMIT) {
      logger.info(`New play session for user ${userId} => ` +
        `${playSessionNumber} active now`)

      setTimeout(() => {
        removePlayContentSession(userId)
          .catch(err => logger.error(err))
      }, 10000)

      return resolve()
    }
    else {
      logger.info(`Reached max play sessions limit for user ${userId}`)
      redisClient.decr(userId)
      return reject(new Error(MAX_LIMIT_ERR_MSG))
    }
  })
})

const removePlayContentSession = userId => new Promise((resolve, reject) => {
  redisClient.decr(userId, (err, playSessionNumber) => {
    if (err) return reject(err)
    logger.info(`Closed play session for user ${userId} => ` +
    `${playSessionNumber} active now`)
    return resolve()
  })
})

// TODO: add access token caching

// const registerAccountSession = userId => new Promise((resolve, reject) => {
//   redisClient.setnx(userId, 0, err => { // set if not exists
//     if (err) return reject(err)
//     logger.info(`User ${userId} account session registered`)
//     return resolve()
//   })
// })

// const deleteAccountSession = userId => new Promise((resolve, reject) => {
//   redisClient.del(userId, err => {
//     if (err) return reject(err)
//     logger.info(`User ${userId} account session removed`)
//     return resolve()
//   })
// })


/* middleware */
export const session = ({ type, action }) => async ({ user }, res, next) => {
  switch (type) {
    case 'content':
      if (action === 'play') {
        await addPlayContentSession(user.id)
          .then(next)
          .catch(err => {
            if (err.message === MAX_LIMIT_ERR_MSG) {
              return res.status(400).end()
            }
            else return res.status(500).end()
          })
      }
      else if (action === 'remove') {
        removePlayContentSession(user.id)
          .then(next)
          .catch(err => logger.error(err))
      }
      
      break;
    case 'account':
      // TODO
      break;
    default:
      logger.error('Invalid session type')
      break;
  }
}
