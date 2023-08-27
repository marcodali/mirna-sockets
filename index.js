import { createServer } from 'http'
import { parse } from 'url'
import express from 'express'
import cors from 'cors'
import injectRoutes, { socketsMap } from './routes.js'

const PORT = process.env.PORT || 5000
const app = express()

// Enable CORS
app.use(cors())

const logger = (options) => (req, res, next) => {
  const timestamp = new Date().toLocaleString()
  const { method, url, hostname } = req
  console.log(`at ${timestamp} from ${hostname} ${method} ${url}`)
  next()
}

const errorHandler = (err, req, res, next) => {
  console.error('Middleware Error Handling', err)
  res.status(err.statusCode || 500).send(err?.message || 'Algo malo paso')
}

// log all requests middleware
app.use(logger({ level: 'INFO' }))

// Routes
injectRoutes(app)

// error handling middleware
app.use(errorHandler)

const server = createServer(app)

server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url)

  const wss = socketsMap.get(pathname)
  if (wss) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(0)
  }
  console.log(`Server ready at http://localhost:${PORT}`)
})
