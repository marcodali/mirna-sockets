import WebSocket from 'ws'

//const ws = new WebSocket(`ws://localhost:2000/whiteswan566/muffin`)
const ws = new WebSocket(`wss://socket.mirna.cloud/purplemeercat833/5551212`)

ws.on('error', console.error)

ws.on('open', () => {
  ws.send('soy cox que esperabas?')
});

ws.on('message', (data) => {
  console.log('recibido pareja cambio: %s', data)
})
