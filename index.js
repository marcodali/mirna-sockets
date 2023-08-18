import { createServer } from 'http'
import { parse } from 'url'
import express from 'express'
import cors from 'cors'
import injectRoutes, { socketsMap } from './routes.js'

const PORT = process.env.PORT || 5000
const app = express()

// Enable CORS
app.use(cors())

// Routes
injectRoutes(app)

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
