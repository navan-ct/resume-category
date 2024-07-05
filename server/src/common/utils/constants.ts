export const InfoMessages = {
  DATABASE_CONNECTED: 'Connected to the database',
  DATABASE_DISCONNECTED: 'Disconnected from the database',
  DATABASE_SEEDED: 'Seeded the database',
  SERVER_STARTED: 'Started the server',
  SERVER_STOPPED: 'Stopped the server'
} as const

export const ErrorMessages = {
  GENERIC: 'Something went wrong',
  NOT_FOUND: "Couldn't find the route",
  ENVIRONMENT_VARIABLE: 'One or more environment variables are missing',
  RESUME_ID: "Couldn't find the resume",
  CATEGORY_ID: "Couldn't find the category"
} as const
