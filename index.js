import express from 'express'
import { WebSocketServer } from 'ws';
import { createServer } from 'http'
import { parse } from 'url'

const app = express()
const socketsMap = new Map();

// Routes
app.post('/socket', express.json(), (req, res) => {
  const dynamicWSS = new WebSocketServer({ noServer: true })
  dynamicWSS.on('connection', (ws) => {
    ws.on('error', console.error)

    ws.on('message', (data) => {
      console.log('<%s>: %s', req.body.response, data)
    })
  })
  socketsMap.set(
    `/ws/${req.body.username}/${req.body.project}`,
    dynamicWSS,
  )
  res.status(201).json({
    message: 'new WebSocketServer created successfully',
    url: `ws://localhost:3000/ws/${req.body.username}/${req.body.project}`
  })
})
app.delete('/socket', express.json(), (req, res) => {
  // TODO: pending
})

const server = createServer(app)

server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url)

  const wss = socketsMap.get(pathname)
  if (wss) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    })
  } else {
    socket.destroy()
  }
})

server.listen(process.env.PORT || 3000, (err) => {
  if (err) console.error(err)
  console.log('Server ready at http://localhost:3000')
})
