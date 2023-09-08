import WebSocket from 'ws'

const ws = new WebSocket(`ws://localhost:2000/whiteswan566/muffin`)
//const ws = new WebSocket(`wss://api.mirna.cloud/goldencat269/fishhead`)

ws.on('error', console.error)

ws.on('open', () => {
  ws.send('soy aquel que esperabas?')
});

ws.on('message', (data) => {
  console.log('received: %s', data)
})
