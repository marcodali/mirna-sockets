import express, { Router } from 'express'
import { WebSocketServer } from 'ws';

let dynamicApiRouter = null
// TODO: route_configs should be replaced by a redis database
const route_configs = []
const app = express()

// Routes
app.post('/socket', express.json(), (req, res) => {
  route_configs.push({
    method: 'get',
    path: `/${req.body.username}/${req.body.project}`,
    handler: (request, response) => {
      response.json({ message: req.body.response })
    }
  })
  console.log('route_configs', route_configs)
  setupDynamicRouter()
  res.status(201).json({ message: 'new route created successfully' })
})
app.delete('/socket', express.json(), (req, res) => {
  // TODO: pending
})

// Add routes to dynamicApiRouter from `route_configs`
const setupDynamicRouter = () => {
  dynamicApiRouter = new Router()
  for (const config of route_configs) {
    dynamicApiRouter[config.method](
      config.path,
      config.handler,
    )
  }
}

// Dynamic routes are handled here
app.use('/ws', (req, res, next) => dynamicApiRouter(req, res, next))

// Error handling middleware
app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

// Error handling response
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  })
})

app.listen(process.env.PORT || 3000, err => {
  if (err) console.error(err)
  console.log("Server ready")
})
