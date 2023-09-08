import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

import injectAllRoutes from '../routes/index.route.js'
import { requestLogger, errorHandler } from '../middlewares/basic.middleware.js'
import { dbConnection } from '../middlewares/database.middleware.js'

const PORT = process.env.API_PORT
const app = express()

// Enable CORS
app.use(cors())

// log all requests middleware
app.use(requestLogger({ level: 'INFO' }))

// database middleware
app.use(dbConnection)

// Inject routes to this app
await injectAllRoutes(app)

// error handling middleware
app.use(errorHandler)

const server = createServer(app)

server.listen(PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(0)
  }
  console.log(`API Server listening at http://localhost:${PORT}`)
})
