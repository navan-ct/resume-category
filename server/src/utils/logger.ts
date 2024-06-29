import { createLogger, format, transports } from 'winston'

const consoleFormat = format.combine(
  format.timestamp({ format: 'isoDateTime' }),
  format.printf((info) => {
    return `[${info['timestamp']}] [${info.level.toUpperCase()}] ${info.message}`
  }),
  format.colorize({
    all: true,
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'blue',
      http: 'magenta'
    }
  })
)

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'http',
      format: consoleFormat
    })
  ]
})

export default logger
