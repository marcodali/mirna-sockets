import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

import httpListener from '../pubsub/http.listener.js'
import injectAllRoutes from '../routes/index.route.js'
import createRedis from '../factories/redis.factory.js'
import { requestLogger, errorHandler } from '../middlewares/basic.middleware.js'
import { dbConnection } from '../middlewares/database.middleware.js'
import shutDown from '../pubsub/shutdown.listener.js'

export const redis = createRedis()
const PORT = process.env.API_PORT
const app = express()
const shutDownSignals = ['SIGTERM', 'SIGINT']

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
server.listen(PORT, httpListener('API', PORT))
shutDownSignals.forEach(signal => process.on(
	signal,
	shutDown('API', signal, server, [redis])),
)
