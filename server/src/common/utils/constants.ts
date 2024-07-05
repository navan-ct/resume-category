export const InfoMessages = {
  DATABASE_CONNECTED: 'Connected to the database',
  DATABASE_DISCONNECTED: 'Disconnected from the database',
  DATABASE_SEEDED: 'Seeded the database',
  SERVER_STARTED: 'Started the server',
  SERVER_STOPPED: 'Stopped the server'
} as const

export const ErrorMessages = {
  GENERIC: 'Something went wrong',
  NOT_FOUND: 'Route not found',
  ENVIRONMENT_VARIABLE: 'Missing environment variables',
  RESUME_ID: 'Resume not found',
  CATEGORY_ID: 'Category not found'
} as const
