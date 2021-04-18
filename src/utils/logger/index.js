const winston = require('winston')

const baseLogger = winston.createLogger({
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
})

const createLogger = ({ ctx } = {}) => {
  const logger = {
    logContext: ctx ? ctx.toUpperCase() + ' - ' : '',

    info(message, ...args) {
      baseLogger.info(this.logContext + message, ...args)
    },
    warn(message, ...args) {
      baseLogger.info(this.logContext + message, ...args)
    },
    error(message, ...args) {
      baseLogger.error(this.logContext + message, ...args)
    },
  }
  return logger
}

export {
  createLogger
}