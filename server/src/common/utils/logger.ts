import { createLogger, format, transports } from 'winston'

const consoleFormat = format.combine(
  format.timestamp({ format: 'isoDateTime' }),
  format.printf((info) => {
    return `[${info['timestamp']}] [${info.level}] ${info.message}`
  }),
  format.colorize({
    all: true,
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'blue'
    }
  })
)

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: consoleFormat
    })
  ]
})

export default logger
