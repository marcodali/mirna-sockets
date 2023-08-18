import WebSocket from 'ws';

const PORT = process.env.PORT || 5000
const ws = new WebSocket(`ws://localhost:${PORT}/brian/tinderbook`);

ws.on('error', console.error);

ws.on('open', () => {
  ws.send('soy briandeveloper.tk')
});

ws.on('message', (data) => {
  console.log('received: %s', data)
})
