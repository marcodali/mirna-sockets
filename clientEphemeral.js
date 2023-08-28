import WebSocket from 'ws'

const ws = new WebSocket(`ws://localhost:5000/sadsnake657/blackbir`)
//const ws = new WebSocket(`wss://api.mirna.cloud/whitebear764/shovel`)

ws.on('error', console.error)

ws.on('open', () => {
  ws.send('soy aquel que esperabas?')
});

ws.on('message', (data) => {
  console.log('received: %s', data)
})
