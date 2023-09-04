import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { parse } from 'url'

import createRedis from '../factories/redis.factory.js'
import { socketProvider } from '../providers/socket.provider.js'
import listenerCreate from '../listeners/create.listener.js'
import listenerDelete from '../listeners/delete.listener.js'

const redisMapListener = {
  create: listenerCreate,
  delete: listenerDelete,
}

const app = express()
const channels = Object.keys(redisMapListener)

const subscriber = createRedis()
export const redis = createRedis()

// Enable CORS
app.use(cors())

subscriber.subscribe(channels, (err, count) => {
  if (err) {
    console.error('At redis subscription something went wrong', err)
  }
  console.log(`Subscribed to ${
    count
  } channel(s) Listening for messages on the [${
    channels
  }] channel(s).`)
})

subscriber.on('message', (channel, message) => {
  if (channel in redisMapListener) {
    redisMapListener[channel](message)
  }
})

const server = createServer(app)

server.on('upgrade', (request, socket, head) => {
  const { pathname } = parse(request.url)

  const wss = socketProvider.getOneSocket(pathname)
  if (wss) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(process.env.SOCKET_PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(0)
  }
  console.log(`Socket Server listening at http://localhost:${process.env.SOCKET_PORT}`)
})
